import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../common/modules/config/config.service';
import { UnauthorizedException } from '@nestjs/common';
import * as crypteUtils from '../../common/utils/crypte';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

let mockOAuth2ClientConstructor: jest.Mock;

let mockVerifyIdTokenMethod: jest.Mock;

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn(),
  };
});

const mockUser = {
  id: '1',
  email: 'test@test.com',
  role: 'CLIENT',
  password: 'hashed',
  full_name: 'Test User',
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockUserService = {
  create: jest.fn(),
  getByEmail: jest.fn(),
  updatePassword: jest.fn(),
  updateLastLogin: jest.fn(),
};

const mockConfigService = {
  jwtSecret: 'test-secret',
  googleClientIdAndroid: 'mock-google-client-id-android',
  googleClientIdSecret: 'mock-google-client-id-secret',
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: typeof mockUserService;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockVerifyIdTokenMethod = jest.fn();

    const { OAuth2Client: MockedOAuth2ClientInternal } = await import(
      'google-auth-library'
    );
    mockOAuth2ClientConstructor =
      MockedOAuth2ClientInternal as unknown as jest.Mock;

    mockOAuth2ClientConstructor.mockImplementation(() => {
      return {
        verifyIdToken: mockVerifyIdTokenMethod,
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AppConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);

    expect(mockOAuth2ClientConstructor).toHaveBeenCalledWith(
      mockConfigService.googleClientIdAndroid,
      mockConfigService.googleClientIdSecret,
    );
  });

  it('doit être défini', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('devrait créer un utilisateur et retourner une session', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: '1234',
        role: 'CLIENT',
        full_name: 'John Doe',
      };

      userService.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.signup(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        token: {
          auth_token: 'signed-token',
          refresh_token: 'signed-token',
        },
        user: mockUser,
      });
    });

    it('devrait lever une erreur si create échoue', async () => {
      userService.create.mockRejectedValue(new Error('Erreur création'));
      await expect(service.signup({} as any)).rejects.toThrow(
        'Erreur création',
      );
    });
  });

  describe('signin', () => {
    beforeAll(() => {
      jest.spyOn(crypteUtils, 'comparePasswords');
    });

    afterEach(() => {
      (crypteUtils.comparePasswords as jest.Mock).mockReset();
    });

    it('devrait connecter un utilisateur avec les bons identifiants', async () => {
      userService.getByEmail.mockResolvedValue(mockUser);
      (crypteUtils.comparePasswords as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.signin('test@test.com', '1234');

      expect(userService.getByEmail).toHaveBeenCalledWith('test@test.com');
      expect(crypteUtils.comparePasswords).toHaveBeenCalledWith(
        '1234',
        'hashed',
      );
      expect(result).toEqual({
        token: {
          auth_token: 'signed-token',
          refresh_token: 'signed-token',
        },
        user: mockUser,
      });
    });

    it('devrait lever une erreur si l’utilisateur n’existe pas', async () => {
      userService.getByEmail.mockResolvedValue(null);
      await expect(service.signin('unknown@test.com', '1234')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('devrait lever une erreur si le mot de passe est invalide', async () => {
      userService.getByEmail.mockResolvedValue(mockUser);
      (crypteUtils.comparePasswords as jest.Mock).mockResolvedValue(false);
      await expect(service.signin('test@test.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('siginGoogle', () => {
    const mockGoogleIdToken = 'mock-valid-google-id-token';
    const mockPayload = {
      email: 'test@test.com',
      sub: 'google_sub_id_123',
      name: 'Test User',
    };

    const mockExistingUser = { ...mockUser, id: '1', email: 'test@test.com' };

    it('devrait créer un nouvel utilisateur et retourner une session pour un ID token valide', async () => {
      mockVerifyIdTokenMethod.mockResolvedValueOnce({
        getPayload: () => mockPayload,
      });

      userService.getByEmail.mockResolvedValueOnce(null);
      userService.create.mockResolvedValueOnce(mockExistingUser);
      jwtService.sign.mockReturnValue('signed-token-google');

      const result = await service.signinGoogle(mockGoogleIdToken);

      expect(mockVerifyIdTokenMethod).toHaveBeenCalledWith({
        idToken: mockGoogleIdToken,
        audience: mockConfigService.googleClientIdAndroid,
      });
      expect(userService.getByEmail).toHaveBeenCalledWith(mockPayload.email);
      expect(userService.create).toHaveBeenCalledWith({
        email: mockPayload.email,
        full_name: mockPayload.name,
      });

      expect(userService.updateLastLogin).not.toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledTimes(2);

      expect(result.user).toEqual(mockExistingUser);
      expect(result.token).toEqual({
        auth_token: 'signed-token-google',
        refresh_token: 'signed-token-google',
      });
    });

    it("devrait lever une UnauthorizedException si la vérification d l'ID token échoue", async () => {
      mockVerifyIdTokenMethod.mockResolvedValueOnce({
        getPayload: () => mockPayload,
      });
      userService.getByEmail.mockResolvedValueOnce(mockExistingUser);
      userService.updateLastLogin.mockResolvedValueOnce(undefined);
      jwtService.sign.mockReturnValue('signed-token-google');

      const result = await service.signinGoogle(mockGoogleIdToken);

      expect(mockVerifyIdTokenMethod).toHaveBeenCalled();
      expect(userService.getByEmail).toHaveBeenCalledWith(mockPayload.email);
      expect(userService.create).not.toHaveBeenCalled();
      expect(userService.updateLastLogin).toHaveBeenCalledWith(
        mockExistingUser.id,
      );
      expect(jwtService.sign).toHaveBeenCalledTimes(2); // generateSession calls sign twice

      expect(result.user).toEqual(mockExistingUser);
      expect(result.token).toEqual({
        auth_token: 'signed-token-google',
        refresh_token: 'signed-token-google',
      });
    });
  });

  describe('refreshToken', () => {
    it('devrait retourner de nouveaux tokens si le token est valide', async () => {
      jwtService.verify.mockReturnValue({
        sub: '1',
        email: 'test@test.com',
        role: 'CLIENT',
      });
      jwtService.sign.mockReturnValue('new-token');

      const result = await service.refreshToken('refresh-token');

      expect(jwtService.verify).toHaveBeenCalledWith('refresh-token', {
        secret: mockConfigService.jwtSecret,
      });
      expect(result).toEqual({
        auth_token: 'new-token',
        refresh_token: 'new-token',
      });
    });

    it('devrait lever une erreur si le token est invalide', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalide');
      });

      await expect(service.refreshToken('invalid')).rejects.toThrow();
    });
  });

  describe('forgotPassword', () => {
    it('devrait générer un token si l’utilisateur existe', async () => {
      userService.getByEmail.mockResolvedValue({ email: 'test@test.com' });
      jwtService.sign.mockReturnValue('reset-token');
      const spy = jest.spyOn(console, 'log').mockImplementation();

      await service.forgotPassword({ email: 'test@test.com' });

      const allArgs = spy.mock.calls.flat();
      expect(allArgs).toContain('reset-token');

      spy.mockRestore();
    });

    it('devrait lever une erreur si l’utilisateur est introuvable', async () => {
      userService.getByEmail.mockResolvedValue(null);

      await expect(
        service.forgotPassword({ email: 'notfound@test.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    it('devrait mettre à jour le mot de passe si tout est valide', async () => {
      jwtService.verify.mockReturnValue({ email: 'test@test.com' });
      userService.getByEmail.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
      });
      userService.updatePassword.mockResolvedValue({});

      await service.resetPassword({ token: 'valid', newPassword: 'newpass' });

      expect(jwtService.verify).toHaveBeenCalledWith('valid', {
        secret: mockConfigService.jwtSecret,
      });
      expect(userService.getByEmail).toHaveBeenCalledWith('test@test.com');
      expect(userService.updatePassword).toHaveBeenCalledWith('1', 'newpass');
    });

    it('devrait lever une erreur si le token est invalide', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('token invalide');
      });

      await expect(
        service.resetPassword({ token: 'invalid', newPassword: 'new' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('devrait lever une erreur si l’utilisateur n’existe pas', async () => {
      jwtService.verify.mockReturnValue({ email: 'notfound@test.com' });
      userService.getByEmail.mockResolvedValue(null);

      await expect(
        service.resetPassword({ token: 'valid', newPassword: 'new' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
