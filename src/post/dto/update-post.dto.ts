import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdatePostInput {
  @Field()
  @IsNumber()
  @IsOptional()
  id: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  header: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  theme: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  text: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  blogId: number;
}
