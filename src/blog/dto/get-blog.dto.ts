import { ArgsType, Field, Int } from '@nestjs/graphql';
import { BlogFields, OrderTypeEnum } from '../../common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from '../../common/dto';

@ArgsType()
export class GetBlogArgs extends PaginationArgs {
  @Field((type) => OrderTypeEnum, { nullable: true })
  @IsEnum(OrderTypeEnum)
  @IsOptional()
  sortValue?: OrderTypeEnum;

  @Field((type) => BlogFields, { nullable: true })
  @IsEnum(BlogFields)
  @IsOptional()
  sortField?: BlogFields;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  filterValue?: string;

  @Field((type) => BlogFields, { nullable: true })
  @IsEnum(BlogFields)
  @IsOptional()
  filterField?: BlogFields;
}
