import { registerEnumType } from '@nestjs/graphql';

export enum UserRoles {
  WRITER = 'WRITER',
  MODERATOR = 'MODERATOR',
}

registerEnumType(UserRoles, {
  name: 'UserRoles',
});
