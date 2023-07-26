import { Test, TestingModule } from '@nestjs/testing';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateBlogInput } from './dto/create-blog.dto';
import { UpdateBlogInput } from './dto/update-blog.dto';
import { GetBlogArgs } from "./dto/get-blog.dto";
import { Blog, User } from "../models";

describe('BlogResolver', () => {
  let resolver: BlogResolver;
  let mockBlogService: any;

  const mockUser: User = new User();

  beforeEach(async () => {
    mockBlogService = {
      create: jest.fn((user: User, dto: CreateBlogInput) => {
        const newBlog = new Blog()
        newBlog.id= Date.now();
        newBlog.title= dto.title;
        newBlog.description= dto.description;
        newBlog.userId= user.id;
        return Promise.resolve(newBlog);
      }),
      getAll: jest.fn((args: GetBlogArgs) => {
        const first = new Blog()
        first.id= 1;
        first.title= 'Mocked Blog 1';
        first.description= 'Mocked Content 1';
        first.userId= 1;

        const second = new Blog()
        second.id= 2;
        second.title= 'Mocked Blog 2';
        second.description= 'Mocked Content 2';
        second.userId= 2;

        const blogs: Blog[] = [
          {...first},{...second}
        ];
        return Promise.resolve(blogs);
      }),
      getOne: jest.fn((id: number) => {
        const blog = new Blog()
        blog.id= 1;
        blog.title= 'Mocked Blog';
        blog.description= 'Mocked Content';
        blog.userId= 1;
        return Promise.resolve(blog);
      }),
      getByUserId: jest.fn((id: number) => {
        const first = new Blog()
        first.id= 1;
        first.title= 'Mocked Blog 1';
        first.description= 'Mocked Content 1';
        first.userId= 1;

        const second = new Blog()
        second.id= 2;
        second.title= 'Mocked Blog 2';
        second.description= 'Mocked Content 2';
        second.userId= 2;

        const blogs: Blog[] = [
          {...first},{...second}
        ];
        return Promise.resolve(blogs);
      }),
      update: jest.fn((user: User, dto: UpdateBlogInput) => {
        const updatedBlog = new Blog()
        updatedBlog.id= Date.now();
        updatedBlog.title= dto.title;
        updatedBlog.description= dto.description;
        updatedBlog.userId= user.id;
        return Promise.resolve(updatedBlog);
      }),
      delete: jest.fn((user: User, id: number) => {
        const deletedBlog = new Blog()
        deletedBlog.id = id;
        deletedBlog.title= 'Deleted Blog';
        deletedBlog.description= 'Deleted Content';
        deletedBlog.userId= user.id;
        return Promise.resolve(deletedBlog);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogResolver, { provide: BlogService, useValue: mockBlogService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    resolver = module.get(BlogResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a blog', async () => {
    const createBlogInput: CreateBlogInput = {
      title: 'Test Blog',
      description: 'Test Content',
    } as UpdateBlogInput;

    const createdBlog = await resolver.createBlog(mockUser, createBlogInput);

    expect(createdBlog).toBeDefined();
    expect(createdBlog.id).toBeDefined();
    expect(createdBlog.title).toBe(createBlogInput.title);
    expect(createdBlog.description).toBe(createBlogInput.description);
  });

  it('should get all blogs', async () => {
    const blogs = await resolver.getAllBlogs({limit: 10, offset: 0});

    expect(blogs).toBeDefined();
    expect(blogs).toHaveLength(2);
    expect(blogs[0].id).toBeDefined();
  });

  it('should get a blog by id', async () => {
    const blogId = 1;
    const blog = await resolver.getBlog(blogId);

    expect(blog).toBeDefined();
    expect(blog.id).toBe(blogId);
  });

  it('should get blogs by author id', async () => {
    const authorId = 1;
    const blogs = await resolver.getBlogByAuthorId(authorId);

    expect(blogs).toBeDefined();
    expect(blogs).toHaveLength(2);
    expect(blogs[0].userId).toBe(authorId);
  });

  it('should update a blog', async () => {
    const updateBlogInput: UpdateBlogInput = {
      id: 1,
      title: 'Updated Blog',
      description: 'Updated Content',
    } as UpdateBlogInput;

    const updatedBlog = await resolver.updateBlog(mockUser, updateBlogInput);

    expect(updatedBlog).toBeDefined();
    expect(updatedBlog.title).toBe(updateBlogInput.title);
    expect(updatedBlog.description).toBe(updateBlogInput.description);
  });

  it('should delete a blog', async () => {
    const blogId = 1;

    const deletedBlog = await resolver.deleteBlog(mockUser, blogId);

    expect(deletedBlog).toBeDefined();
    expect(deletedBlog.id).toBe(blogId);
  });
});