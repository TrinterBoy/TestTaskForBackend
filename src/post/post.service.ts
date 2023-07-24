import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../models';
import { CreatePostInput } from './dto/create-post.dto';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private blogService: BlogService,
  ) {}

  async createPost(createPostInput: CreatePostInput): Promise<Post> {
    try {
      const newPost = this.postRepository.create(createPostInput);
      const blog = await this.blogService.getOne(createPostInput.blogId);
      if (!blog) {
        throw new Error(`There is no blog with id:${createPostInput.blogId}`);
      }
      newPost.blogId = blog.id;
      const result = await this.postRepository.save(newPost);
      return await this.getOne(result.id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: { blog: { user: true } },
    });
  }

  async getOne(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: { blog: { user: true } },
    });
  }
}
