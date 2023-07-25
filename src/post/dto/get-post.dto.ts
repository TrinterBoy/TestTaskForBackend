import { ArgsType, Field, Int } from '@nestjs/graphql';
import { OrderTypeEnum, PostFields } from '../../common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from '../../common/dto';

@ArgsType()
export class GetPostArgs extends PaginationArgs {
  @Field((type) => OrderTypeEnum, { nullable: true })
  @IsEnum(OrderTypeEnum)
  @IsOptional()
  sortValue?: OrderTypeEnum;

  @Field((type) => PostFields, { nullable: true })
  @IsEnum(PostFields)
  @IsOptional()
  sortField?: PostFields;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  filterValue?: string;

  @Field((type) => PostFields, { nullable: true })
  @IsEnum(PostFields)
  @IsOptional()
  filterField?: PostFields;
}
