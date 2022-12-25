import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from 'src/modules/user/user.repository';

@Module({
  providers: [UserResolver, UserService, UserRepository],
})
export class UserModule {}
