import { Entity, Column, ObjectId, PrimaryGeneratedColumn, ObjectIdColumn, BeforeInsert, ManyToOne } from 'typeorm';
import User from './user.entity';


@Entity('post')
export class Post {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column('varchar', { length: 100, nullable: false })
    title: string;

    @Column('varchar', { length: 2000, nullable: false })
    description: string;
    

    @ManyToOne(() => User, (user) => user.posts)
    user: User

}

export default Post;