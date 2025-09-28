import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly redis: Redis,
  ) {}

  private getTTL(): number {
    return parseInt(process.env.REDIS_TTL, 10) || 86400;
  }

  private generateToken(): string {
    return uuidv4();
  }

  // --- REGISTER ---
  async register(body: { name: string; email: string; password: string }) {
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      throw new BadRequestException('Missing fields');
    }

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const savedUser = await user.save();

    const token = this.generateToken();
    await this.redis.set(
      `session:token:${token}`,
      savedUser._id.toString(),
      'EX',
      this.getTTL(),
    );

    return {
      message: 'Registered',
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
      token: { accessToken: token, refreshToken: '' },
    };
  }

  // --- LOGIN ---
  async login(body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password) throw new BadRequestException('Missing fields');

    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken();
    await this.redis.set(`session:token:${token}`, user._id.toString(), 'EX', this.getTTL());

    return {
      user: { id: user._id, name: user.name, email: user.email },
      token: { accessToken: token, refreshToken: '' },
    };
  }

  // --- LOGOUT ---
  async logout(token: string) {
    if (!token) throw new BadRequestException('Token missing');

    const exists = await this.redis.exists(`session:token:${token}`);
    if (exists) {
      await this.redis.del(`session:token:${token}`);
      return { message: 'Logged out successfully' };
    } else {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // --- ME ---
  async me(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    return {
      user: { id: user._id, name: user.name, email: user.email }
    };
  }

  // --- UPDATE USER ---
  async updateUser(id: string, body: { name: string; email: string }) {
    const { name, email } = body;
    if (!name || !email) throw new BadRequestException('Missing fields');

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true },
    ).select('-password');

    return { user };
  }
}
