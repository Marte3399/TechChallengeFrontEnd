import { Entity, Column, ObjectId, PrimaryGeneratedColumn, ObjectIdColumn, BeforeInsert, OneToMany } from 'typeorm';
import Post from './post.entity';


@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column('varchar', { length: 100, nullable: false })
    username: string;

    @Column('varchar', { length: 2000, nullable: false })
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

}

export default User;