import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../models';
import { JwtService } from '@nestjs/jwt';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const {
      req: {
        headers: { authorization },
      },
    } = ctx.getContext();

    const tokenData = new JwtService().decode(authorization.split(' ')[1]);

    return tokenData as User;
  },
);
