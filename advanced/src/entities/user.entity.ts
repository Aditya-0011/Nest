import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Posts } from './post.entity';
import { Files } from './file.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];

  @OneToMany(() => Files, (file) => file.user)
  files: Files[];
}
