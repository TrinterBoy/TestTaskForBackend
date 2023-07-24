import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRoles } from '../../common/enums';
import { IsEmail, IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field((type) => UserRoles)
  @IsEnum(UserRoles)
  role: UserRoles;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  surname: string;

  @Field()
  @IsString()
  password: string;

  @IsNumber()
  @Min(16)
  @Max(110)
  @Field((type) => Int)
  age: number;

  @Field()
  @IsEmail()
  email: string;
}
