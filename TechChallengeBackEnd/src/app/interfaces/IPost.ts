import IUser from "./IUser";

interface IPost {
    id?: number;
    title: string;
    description: string;
    user: IUser;
}

export default IPost;