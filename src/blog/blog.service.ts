import { Injectable } from '@nestjs/common';
import { Blog, User } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogInput } from './dto/create-blog.dto';
import { UserService } from '../user/user.service';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { UpdateBlogInput } from './dto/update-blog.dto';
import { UserRoles } from '../common/enums';
import { ForbiddenError } from '@nestjs/apollo';
import { GetBlogArgs } from './dto/get-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    private userService: UserService,
  ) {}

  async create(
    userRequest: User,
    createBlogInput: CreateBlogInput,
  ): Promise<Blog> {
    try {
      const newBlog = this.blogRepository.create(createBlogInput);
      const user = await this.userService.getOne(
        createBlogInput.userId || userRequest.id,
      );
      if (!user) {
        throw new Error(`There is no user with id:${createBlogInput.userId}`);
      }
      newBlog.userId = user.id;
      const result = await this.blogRepository.save(newBlog);
      return await this.getOne(result.id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(args: GetBlogArgs): Promise<Blog[]> {
    const searchedObject: FindManyOptions<Blog> = {
      relations: { user: true, posts: true },
      skip: args.offset,
      take: args.limit,
    };
    if (args.sortField && args.sortValue) {
      searchedObject.order = { [args.sortField]: args.sortValue };
    }
    if (args.filterValue && args.filterField) {
      searchedObject.where = { [args.filterField]: args.filterValue };
    }
    return await this.blogRepository.find(searchedObject);
  }

  async getOne(id: number): Promise<Blog> {
    return await this.blogRepository.findOne({
      where: { id },
      relations: { user: true, posts: true },
    });
  }

  async getByUserId(userId: number): Promise<Blog[]> {
    return await this.blogRepository.find({
      relations: { user: true, posts: true },
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async update(
    requestUser: User,
    updateBlogInput: UpdateBlogInput,
  ): Promise<Blog> {
    let blog = await this.blogRepository.findOne({
      where: { id: updateBlogInput.id },
      relations: { user: true },
    });
    if (
      blog.user.id !== requestUser.id &&
      requestUser.role !== UserRoles.MODERATOR
    ) {
      throw new ForbiddenError('You dont have permission to update this blog');
    }
    blog = { ...blog, ...updateBlogInput };
    await this.blogRepository.save(blog);
    return await this.getOne(blog.id);
  }

  async delete(requestUser: User, id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (
      blog.user.id !== requestUser.id &&
      requestUser.role !== UserRoles.MODERATOR
    ) {
      throw new ForbiddenError('You dont have permission to delete this blog');
    }
    await this.blogRepository.delete({ id: blog.id });
    return blog;
  }
}
