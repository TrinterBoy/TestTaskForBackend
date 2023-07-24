import { Injectable } from '@nestjs/common';
import { Blog, User } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogInput } from './dto/create-blog.dto';
import { UserService } from '../user/user.service';

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

  async getAll(): Promise<Blog[]> {
    return await this.blogRepository.find({
      relations: { user: true, posts: true },
    });
  }

  async getOne(id: number): Promise<Blog> {
    return await this.blogRepository.findOne({
      where: { id },
      relations: { user: true, posts: true },
    });
  }
}
