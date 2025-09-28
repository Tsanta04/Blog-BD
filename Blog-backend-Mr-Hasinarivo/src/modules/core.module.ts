import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeUserModule } from './like-user/like-user.module';
import { LikePostModule } from './like-post/like-post.module';


@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    PostModule,
    CommentModule,
    LikeUserModule,
    LikePostModule,
  ],
  providers: [],
  exports: [JwtModule],
})
export class CoreModule {}
