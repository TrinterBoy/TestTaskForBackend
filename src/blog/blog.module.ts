import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../models';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UserModule],
  providers: [BlogService, BlogResolver, JwtService],
  exports: [BlogService],
})
export class BlogModule {}
