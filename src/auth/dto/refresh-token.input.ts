import { ArgsType, Field } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@ArgsType()
export class RefreshTokenInput {
  @Field()
  @IsJWT()
  token: string;
}
