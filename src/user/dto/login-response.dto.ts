import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class LoginResponse {
  @Field()
  @IsString()
  token: string;
}
