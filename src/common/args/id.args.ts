import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ArgsType()
export class IdArgs {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
