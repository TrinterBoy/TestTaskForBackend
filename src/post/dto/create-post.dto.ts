import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  header: string;

  @Field()
  @IsString()
  theme: string;

  @Field()
  @IsString()
  text: string;

  @Field()
  @IsNumber()
  blogId: number;
}
