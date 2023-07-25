import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Blog, User } from '../models';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './dto/create-blog.dto';
import { AuthUser } from '../common/decorators';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { UpdateBlogInput } from './dto/update-blog.dto';
import { GetBlogArgs } from './dto/get-blog.dto';

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
  getAllBlogs(@Args() args: GetBlogArgs): Promise<Blog[]> {
    return this.blogService.getAll(args);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Blog)
  getBlog(@Args('id', { type: () => Int }) id: number): Promise<Blog> {
    return this.blogService.getOne(id);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => [Blog])
  getBlogByAuthorId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Blog[]> {
    return this.blogService.getByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Blog)
  updateBlog(
    @AuthUser() user: User,
    @Args('updateBlogInput') updateBlogInput: UpdateBlogInput,
  ): Promise<Blog> {
    return this.blogService.update(user, updateBlogInput);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => Blog)
  deleteBlog(
    @AuthUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Blog> {
    return this.blogService.delete(user, id);
  }
}
