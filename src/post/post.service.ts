import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, User } from '../models';
import { CreatePostInput } from './dto/create-post.dto';
import { BlogService } from '../blog/blog.service';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { UserRoles } from '../common/enums';
import { ForbiddenError } from '@nestjs/apollo';
import { UpdatePostInput } from './dto/update-post.dto';
import { GetPostArgs } from './dto/get-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private blogService: BlogService,
  ) {}

  async createPost(createPostInput: CreatePostInput): Promise<Post> {
    try {
      const blog = await this.blogService.getOne(createPostInput.blogId);
      if (!blog) {
        throw new Error(`There is no blog with id:${createPostInput.blogId}`);
      }
      const newPost = this.postRepository.create(createPostInput);
      newPost.blogId = blog.id;
      const result = await this.postRepository.save(newPost);
      return await this.getOne(result.id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(args: GetPostArgs): Promise<Post[]> {
    const searchedObject: FindManyOptions<Post> = {
      relations: { blog: { user: true } },
      skip: args.offset,
      take: args.limit,
    };
    if (args.sortField && args.sortValue) {
      searchedObject.order = { [args.sortField]: args.sortValue };
    }
    if (args.filterValue && args.filterField) {
      searchedObject.where = { [args.filterField]: args.filterValue };
    }
    return await this.postRepository.find(searchedObject);
  }

  async getOne(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: { blog: { user: true } },
    });
  }

  async update(
    requestUser: User,
    updatePostInput: UpdatePostInput,
  ): Promise<Post> {
    let post = await this.postRepository.findOne({
      where: { id: updatePostInput.id },
      relations: { blog: { user: true } },
    });
    if (
      post.blog.user.id !== requestUser.id &&
      requestUser.role !== UserRoles.MODERATOR
    ) {
      throw new ForbiddenError('You dont have permission to update this blog');
    }
    post = { ...post, ...updatePostInput };
    await this.postRepository.save(post);
    return await this.getOne(post.id);
  }

  async delete(requestUser: User, id: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: { blog: { user: true } },
      });
      if (
        post.blog.user.id !== requestUser.id &&
        requestUser.role !== UserRoles.MODERATOR
      ) {
        throw new ForbiddenError(
          'You dont have permission to delete this blog',
        );
      }
      await this.postRepository.delete({ id: post.id });
      return post;
    } catch (error) {
      throw new Error(error);
    }
  }
}
