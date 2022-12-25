import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

import { User } from 'src/modules/user/models/user.model';

@Resolver(() => User)
export class UserResolver {
  @UseGuards(GqlAuthGuard)
  @Query(() => String, { name: 'me' })
  async me(@AuthUser() authUser: User) {
    console.log('authUser', authUser);
    return 'hello';
  }
}
