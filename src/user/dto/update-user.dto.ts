import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRoles } from '../../common/enums';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class UpdatedUserInput {
  @Field((type) => UserRoles, { nullable: true })
  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  surname?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;

  @IsNumber()
  @Min(16)
  @Max(110)
  @Field((type) => Int, { nullable: true })
  @IsOptional()
  age?: number;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;
}
