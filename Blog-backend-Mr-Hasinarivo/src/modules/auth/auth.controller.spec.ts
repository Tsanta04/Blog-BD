import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';

const mockAuthService = {
  signup: jest.fn(),
  signin: jest.fn(),
  signinGoogle: jest.fn(),
  refreshToken: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.resetAllMocks();
  });

  it('doit être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('doit appeler signup et définir le cookie', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: '1234',
        role: 'CLIENT',
        full_name: 'John Doe',
      };
      const session = {
        token: { auth_token: 'token', refresh_token: 'refresh' },
        user: { id: '1', email: 'test@test.com' },
      };
      mockAuthService.signup.mockResolvedValue(session);

      const res = { cookie: jest.fn() } as unknown as Response;
      const result = await controller.register(dto, res);

      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh',
        expect.objectContaining({
          httpOnly: true,
          path: '/auth/refresh',
        }),
      );
      expect(result).toEqual(session);
    });

    it('doit lever une erreur si signup échoue', async () => {
      const dto: CreateUserDto = {
        email: 'fail@test.com',
        password: '1234',
        role: 'CLIENT',
        full_name: 'John Doe',
      };
      mockAuthService.signup.mockRejectedValue(new UnauthorizedException());

      const res = { cookie: jest.fn() } as unknown as Response;
      await expect(controller.register(dto, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('doit appeler signin et définir le cookie', async () => {
      const dto: LoginDto = {
        email: 'test@test.com',
        password: '1234',
      };
      const session = {
        token: { auth_token: 'token', refresh_token: 'refresh' },
        user: { id: '1', email: 'test@test.com' },
      };
      mockAuthService.signin.mockResolvedValue(session);

      const res = { cookie: jest.fn() } as unknown as Response;
      const result = await controller.login(dto, res);

      expect(mockAuthService.signin).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh',
        expect.objectContaining({
          httpOnly: true,
          path: '/auth/refresh',
        }),
      );
      expect(result).toEqual(session);
    });

    it('doit lever une erreur si signin échoue', async () => {
      const dto: LoginDto = {
        email: 'error@test.com',
        password: 'wrong',
      };
      mockAuthService.signin.mockRejectedValue(new UnauthorizedException());

      const res = { cookie: jest.fn() } as unknown as Response;
      await expect(controller.login(dto, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('google-login', () => {
    it('doit appeler sginGoogle et définir le cookie', async () => {
      const idToken: string = 'google-token-123';
      const session = {
        token: {
          auth_token: 'google-auth-token',
          refresh_token: 'google-refresh-token',
        },
        user: { id: '2', email: 'google@test.com', full_name: 'Google User' },
      };
      mockAuthService.signinGoogle.mockResolvedValue(session);
      const res = { cookie: jest.fn() } as unknown as Response;
      const result = await controller.googleLogin(idToken, res);

      expect(mockAuthService.signinGoogle).toHaveBeenCalledWith(idToken);
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'google-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          path: '/auth/refresh',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }),
      );
      expect(result).toEqual(session);
    });

    it('doit lever une erruer si signingoogle échoue', async () => {
      const idToken: string = 'invalid-google-id-token';
      mockAuthService.signinGoogle.mockRejectedValue(
        new UnauthorizedException('Inalid Google ID Token'),
      );

      const res = { cookie: jest.fn() } as unknown as Response;
      await expect(controller.googleLogin(idToken, res)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.signinGoogle).toHaveBeenCalledWith(idToken);
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('doit appeler refreshToken et définir le cookie', async () => {
      const req = { cookies: { refresh_token: 'old-refresh' } } as any;
      const res = { cookie: jest.fn() } as unknown as Response;
      const tokens = {
        auth_token: 'new',
        refresh_token: 'new-refresh',
      };
      mockAuthService.refreshToken.mockResolvedValue(tokens);

      const result = await controller.refresh(req, res);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('old-refresh');
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh',
        expect.objectContaining({
          httpOnly: true,
          path: '/auth/refresh',
        }),
      );
      expect(result).toEqual({ auth_token: 'new' });
    });

    it('doit lever une erreur si le cookie est absent', async () => {
      const req = { cookies: {} } as any;
      const res = { cookie: jest.fn() } as unknown as Response;

      await expect(controller.refresh(req, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('doit supprimer le cookie et retourner le message', async () => {
      const res = { clearCookie: jest.fn() } as unknown as Response;
      const result = await controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', {
        path: '/auth/refresh',
      });
      expect(result).toEqual({
        message: 'Déconnexion effectuée côté client (cookie supprimé)',
      });
    });
  });

  describe('forgotPassword', () => {
    it('doit appeler forgotPassword du service', async () => {
      const dto: ForgotPasswordDto = { email: 'test@test.com' };
      mockAuthService.forgotPassword.mockResolvedValue(undefined);

      await controller.forgotPassword(dto);

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('resetPassword', () => {
    it('doit appeler resetPassword du service', async () => {
      const dto: ResetPasswordDto = {
        token: 'token',
        newPassword: 'new',
      };
      mockAuthService.resetPassword.mockResolvedValue(undefined);

      await controller.resetPassword(dto);

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
    });
  });
});
