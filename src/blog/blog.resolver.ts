import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Blog, User } from '../models';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './dto/create-blog.dto';
import { AuthUser } from '../common/decorators';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

@Resolver((of) => Blog)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @UseGuards(AuthGuard)
  @Mutation((returns) => Blog)
  createBlog(
    @AuthUser() user: User,
    @Args('createBlogInput') createBlogInput: CreateBlogInput,
  ): Promise<Blog> {
    return this.blogService.create(user, createBlogInput);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => [Blog])
  getAllBlogs(): Promise<Blog[]> {
    return this.blogService.getAll();
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Blog)
  getBlog(@Args('id', { type: () => Int }) id: number): Promise<Blog> {
    return this.blogService.getOne(id);
  }
}
