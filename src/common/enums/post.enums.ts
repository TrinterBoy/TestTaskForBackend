import { registerEnumType } from '@nestjs/graphql';

export enum PostFields {
  id = 'id',
  header = 'header',
  theme = 'theme',
  text = 'text',
  blogId = 'blogId',
}

registerEnumType(PostFields, {
  name: 'PostFields',
});
