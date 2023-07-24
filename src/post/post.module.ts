import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../models';
import { BlogModule } from '../blog/blog.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), BlogModule, UserModule],
  providers: [PostService, PostResolver, JwtService],
})
export class PostModule {}
