import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ApolloError } from 'apollo-server-express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { SecurityConfig } from 'src/configs/interfaces/config.interface';
import { User } from 'src/modules/user/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    const securityConfig = configService.get<SecurityConfig>('security');
    console.log('securityConfig', securityConfig);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: securityConfig.accessSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new ApolloError('인증에 실패했습니다.', 'UNAUTHORIZED');
    }

    return user;
  }
}
