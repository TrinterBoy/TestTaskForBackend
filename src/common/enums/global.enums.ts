import { registerEnumType } from '@nestjs/graphql';

export enum OrderTypeEnum {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(OrderTypeEnum, {
  name: 'OrderTypeEnum',
});
