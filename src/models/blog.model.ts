import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';
import { Post } from './post.model';

@Entity({ name: 'blogs' })
@ObjectType()
export class Blog {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  public updated_at: Date;

  @Column()
  @Field((type) => Int)
  userId: number;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @Field((type) => User)
  user: User;

  @OneToMany(() => Post, (post) => post.blog)
  @Field((type) => [Post], { nullable: true })
  posts?: Post[];
}
