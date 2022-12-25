import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApolloError } from 'apollo-server-errors';
import { SignInInput } from 'src/auth/dto/sign-in.input';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Token } from 'src/auth/models/token.model';
import { SecurityConfig } from 'src/configs/interfaces/config.interface';
import { User } from 'src/modules/user/models/user.model';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(input: SignUpInput): Promise<Token> {
    const email = input.email.toLowerCase();
    const data = { ...input, email };

    const user = await this.userRepository.findOneByEmail(email);

    if (user) {
      throw new ApolloError(
        '중복된 이메일로 생성된 유저가 있습니다.',
        'DUPLICATED_EMAIL',
        { data: email },
      );
    }

    const newUser = await this.userRepository.create({ data });

    return this.generateTokens({ userId: newUser.id });
  }

  async signInUser({ email }: SignInInput): Promise<Token> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new ApolloError('유저를 찾을 수 없습니다.', 'CANNOT_FIND_USER', {
        data: email,
      });
    }

    return this.generateTokens({ userId: user.id });
  }

  async validateUser(userId: string): Promise<User> {
    return this.userRepository.findOne(userId);
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');

    return this.jwtService.sign(payload, {
      secret: securityConfig.accessSecret,
      expiresIn: securityConfig.expiresIn,
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');

    return this.jwtService.sign(payload, {
      secret: securityConfig.refreshSecret,
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    const securityConfig = this.configService.get<SecurityConfig>('security');

    try {
      const { userId } = this.jwtService.verify<JwtPayload>(token, {
        secret: securityConfig.refreshSecret,
      });

      return this.generateTokens({ userId });
    } catch (e) {
      throw new ApolloError('unauthorized', 'UNAUTHORIZED');
    }
  }
}
