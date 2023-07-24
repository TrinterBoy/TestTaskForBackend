import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '../common/enums';
import { Blog } from './blog.model';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  surname: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.WRITER,
  })
  @Field((type) => UserRoles)
  role: UserRoles;

  @Column()
  @Field((type) => Int)
  age: number;

  @Column()
  @Field((type) => Int)
  email: string;

  @Column()
  @Field()
  password: string;

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

  @OneToMany(() => Blog, (blog) => blog.user)
  @Field((type) => [Blog], { nullable: true })
  blogs?: Blog[];
}
