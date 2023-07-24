import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { User } from '../models';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.dto';
import { LoginResponse } from './dto/login-response.dto';
import { LoginInput } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { UpdatedUserInput } from './dto/update-user.dto';
import { AuthUser } from '../common/decorators';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query((returns) => [User])
  users(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Mutation((returns) => User)
  registration(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => LoginResponse)
  login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponse> {
    return this.userService.login(loginInput);
  }

  @Mutation((returns) => User)
  updateUser(
    @AuthUser() user: User,
    @Args('updatedUserInput') updatedUserInput: UpdatedUserInput,
  ): Promise<User> {
    return this.userService.updateUser(user, updatedUserInput);
  }

  @Mutation((returns) => User)
  deleteUser(
    @AuthUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User> {
    return this.userService.deleteUser(user, id);
  }
}
