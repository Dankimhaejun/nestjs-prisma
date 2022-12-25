import { Field, ObjectType } from '@nestjs/graphql';
import { User as UserDB } from '@prisma/client';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class User extends BaseModel {
  @Field(() => String)
  email: UserDB['email'];

  @Field(() => String, { nullable: true })
  name: UserDB['name'];
}
