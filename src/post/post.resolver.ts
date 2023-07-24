import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Post } from '../models';
import { PostService } from './post.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.dto';

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
  @Query((returns) => [Post])
  getPost(): Promise<Post[]> {
    return this.portService.getAll();
  }

  @UseGuards(AuthGuard)
  @Query((returns) => [Post])
  getAllPosts(): Promise<Post[]> {
    return this.portService.getAll();
  }
}
