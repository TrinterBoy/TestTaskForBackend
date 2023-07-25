import { registerEnumType } from '@nestjs/graphql';

export enum BlogFields {
  id = 'id',
  title = 'title',
  description = 'description',
  userId = 'userId',
}

registerEnumType(BlogFields, {
  name: 'BlogFields',
});
