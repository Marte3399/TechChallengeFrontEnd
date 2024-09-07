import Post from "../entities/post.entity";
import IPost from "../interfaces/IPost";
import { AppDataSource } from "../../database/data-source";
import { Like } from "typeorm";

export class PostRepository {
    private repository = AppDataSource.getRepository(Post);

    getPosts = (): Promise<IPost[]> => {
        return this.repository.find({
            relations: { user: true, },
            select: { user: { username: true, id: true } }
        });
    }
    getPostById = (id: number): Promise<IPost | null> => {
        return this.repository.findOne({
            where: { id },
            relations: { user: true, },
            select: { user: { username: true, id: true } }
        });
    };
    getPostByAdminId = (id: number): Promise<IPost[] | null> => {
        return this.repository.find({
            where: { user: { id } },
            relations: { user: true, },
            select: { user: { username: true, id: true } }
        });
    };
    createPost = async (post: IPost): Promise<IPost> => {
        const {
            title,
            description,
        } = post
        const newPost = this.repository.create({
            title,
            description,
            user: { id: post.user.id }
        });
        return await this.repository.save(newPost);
    };
    updatePost = async (id: number, updatedData: Partial<IPost>): Promise<IPost | null> => {
        await this.repository.update(id, updatedData);
        const updatedPost = await this.repository.findOne({ where: { id } });
        if (updatedPost != null) {
            this.repository.merge(updatedPost, updatedData);
            const res = this.repository.save(updatedPost);
            return res;
        }
        return null

    };

    deletePost = async (id: number): Promise<boolean> => {
        const deleteResult = await this.repository.delete(id);
        return deleteResult.affected !== 0;
    };

    searchInPosts = (worlds: string): Promise<IPost[]> => {
        return this.repository.find({
            where: [{ title: Like(`%${worlds}%`) }, { description: Like(`%${worlds}%`) }, { user: { username: Like(`%${worlds}%`) } }],
            relations: { user: true, },
            select: { user: { username: true, id: true } }
        });
    }


}

export default {
    PostRepository
};