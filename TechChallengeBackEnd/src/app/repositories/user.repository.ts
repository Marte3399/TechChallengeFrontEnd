import User from "../entities/user.entity";
import IUser from "../interfaces/IUser";
import { AppDataSource } from "../../database/data-source";

export class UserRepository {
    private repository = AppDataSource.getRepository(User);
    findUsernameByNameAndPassword = (username: string, password:string): Promise<IUser | null> => {
       return this.repository.findOne({ where: { username:username, password:password } });
    }

    insertNewUser = async (username: string, password:string): Promise<IUser> => {
 
        const newPost = this.repository.create({
            username,
            password,
        });
        return await this.repository.save(newPost);
     }
  }


export default { UserRepository };