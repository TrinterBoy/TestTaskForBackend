import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { Post, User } from '../models';
import { PostService } from './post.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.dto';
import { AuthUser } from '../common/decorators';
import { UpdatePostInput } from './dto/update-post.dto';
import { GetPostArgs } from './dto/get-post.dto';

@Resolver((of) => Post)
export class PostResolver {
  constructor(private portService: PostService) {}

  @UseGuards(AuthGuard)
  @Mutation((returns) => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    return this.portService.createPost(createPostInput);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Post)
  getPost(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return this.portService.getOne(id);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => [Post])
  getAllPosts(@Args() args: GetPostArgs): Promise<Post[]> {
    return this.portService.getAll(args);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Post)
  updatePost(
    @AuthUser() user: User,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<Post> {
    return this.portService.update(user, updatePostInput);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Post)
  deletePost(
    @AuthUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Post> {
    return this.portService.delete(user, id);
  }
}
