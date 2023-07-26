import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../common/guards/auth.guard";
import { UpdatePostInput } from "./dto/update-post.dto";
import { UserRoles } from "../common/enums";
import { Blog, Post, User } from "../models";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BlogService } from "../blog/blog.service";
import { CreatePostInput } from "./dto/create-post.dto";
import clearAllMocks = jest.clearAllMocks;

describe('PostService', () => {
  let service: PostService;

  const mockUser: User = new User();
  mockUser.id = 3;
  mockUser.role = UserRoles.MODERATOR;

  const mockPost: Post = new Post();
  mockPost.id = 1;
  mockPost.blogId= 1,
  mockPost.text = "a",
  mockPost.theme = 'a',
  mockPost.header = 'a',
  mockPost.blog = new Blog();
  mockPost.blog.user = {
    id:3
  } as User

  const posts = [{
    ...mockPost
  }]
  const mockJwtService = {};
  const mockRepo = {
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve(posts.find(el=>el.id==1))
    }),
    save: jest.fn().mockImplementation((dto: CreatePostInput) => Promise.resolve({id: 1, ...dto })),
    create: jest.fn().mockImplementation((dto: CreatePostInput) => dto)
  };
  const mockBlogService = {
    getOne: jest.fn().mockImplementation((id: number) => {
      return Promise.resolve({
        id,
        title: "test"
      })
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, BlogService, JwtService,
        {
        provide: getRepositoryToken(Post),
        useValue: mockRepo,
        },
      ],
    })
      .overrideProvider(BlogService)
      .useValue(mockBlogService)
      .overrideGuard(AuthGuard)
      .useValue(mockJwtService)
      .compile();

    service = module.get(PostService);
  });

  afterEach(()=>{
    clearAllMocks();
  })

  it('should be defined', () => {
      expect(service).toBeDefined();
    },
  );

  it('should create post', async () => {
    const createData = new CreatePostInput()
    createData.blogId = 1;
    createData.text = "a";
    createData.theme = 'a';
    createData.header = 'a'
    expect(await service.createPost(createData)).toEqual({
      blogId: 1,
      text: "a",
      theme: 'a',
      header: 'a',
      id: 1,
      blog:{
        user: {
          id: 3
        }
      }
    })
  })

  describe('update', () => {
    it('should update the post', async () => {
      const updateData: UpdatePostInput = {
        id: 1,
        text: 'a',
        theme: 'a',
        header: 'a',
      } as UpdatePostInput;

      const updatedPost = await service.update(mockUser, updateData)

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: updateData.id }, relations: { blog: { user: true } } });
      expect(mockRepo.save).toHaveBeenCalledWith({ ...mockPost, ...updateData });
      expect(updatedPost).toEqual({ ...mockPost, ...updateData });
    });

    it('should throw a ForbiddenError if the user does not have permission', async () => {
      const updateData: UpdatePostInput = {
        id: 1,
        text: 'a',
        theme: 'a',
        header: 'a',
      } as UpdatePostInput;

      mockUser.role = UserRoles.WRITER;
      mockUser.id = 5;

      await expect(service.update(mockUser, updateData)).rejects.toThrowError();
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: updateData.id }, relations: { blog: { user: true } } });
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

});
