import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { AuthService } from 'src/auth/auth.service';
import { SignInInput } from 'src/auth/dto/sign-in.input';
import { Token } from 'src/auth/models/token.model';
import { RefreshTokenInput } from 'src/auth/dto/refresh-token.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token, { name: 'signUp' })
  async signUp(@Args('input') input: SignUpInput): Promise<Token> {
    const { accessToken, refreshToken } = await this.authService.createUser(
      input,
    );

    return { accessToken, refreshToken };
  }

  @Mutation(() => Token, { name: 'signIn' })
  async signIn(@Args('input') input: SignInInput): Promise<Token> {
    const { accessToken, refreshToken } = await this.authService.signInUser(
      input,
    );

    return { accessToken, refreshToken };
  }

  @Mutation(() => Token, { name: 'refreshToken' })
  async refreshToken(@Args() { token }: RefreshTokenInput): Promise<Token> {
    return this.authService.refreshToken(token);
  }
}
