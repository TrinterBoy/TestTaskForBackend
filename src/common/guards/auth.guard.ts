import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const {
      req: {
        headers: { authorization },
      },
    } = ctx.getContext();

    if (!authorization) return false;
    const tokenData = this.jwtService.decode(authorization.split(' ')[1]);
    if (!tokenData) return false;
    const user = await this.userService.getByEmail(tokenData['email']);
    if (!user) return false;

    return true;
  }
}
