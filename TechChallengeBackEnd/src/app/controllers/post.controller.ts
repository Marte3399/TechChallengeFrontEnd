import { Request, Response, Router } from 'express';
import { PostRepository } from '../repositories/post.repository';
import { CustomRequest } from '../middleware/auth';


export class PostController {

  private repository: PostRepository;

  constructor(repository: PostRepository) {
    this.repository = repository;
  }
  read = async (_: Request, res: Response) => {
     // #swagger.description = 'Buscar lista de todos os posts'
    try {
      const posts = await this.repository.getPosts();
      return res.json(posts);
    }
    catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  readId = async (req: Request, res: Response) => {
     // #swagger.description = 'Buscar um post por um id especifico'
    try {
      const postId = parseInt(req.params.id); 
      const post = await this.repository.getPostById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.json(post);
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  create = async (req: CustomRequest, res: Response) => {
     // #swagger.description = 'Criar um post'
    const {title, description,} = req.body
    const authorId = req._id
    if (!title) {
      return res.status(400).json({ mensagem: 'The title is mandatory' })
    }
    if (!description) {
      return res.status(400).json({ mensagem: 'The description is mandatory' })
    }

    try {
      if (authorId) {
        const newPost = await this.repository.createPost({ title: title, description: description, user: { id: authorId } })
        return res.status(201).json(newPost)
      }
      return res.status(500).json({ message: 'Invalid author' })

    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  update = async (req: CustomRequest, res: Response) => {
     // #swagger.description = 'Atualizar um post'
    const {title, description,} = req.body
    const authorId = req._id
    const { id } = req.params;
    if (!title) {
      return res.status(400).json({ mensagem: 'The title is mandatory' })
    }
    if (!description) {
      return res.status(400).json({ mensagem: 'The description is mandatory' })
    }

    try {
      if (authorId) {
        const newPost = await this.repository.updatePost(parseInt(id),{ title: title, description: description })
        if(newPost)
        {
          return res.status(200).json(newPost)
        }
        return res.status(404).json({ message: 'Post not found' })
      }
      return res.status(500).json({ message: 'Invalid author' })

    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  readAdmin = async (req: CustomRequest, res: Response) => {
     // #swagger.description = 'Buscar lista de todos os posts criado pelo usuario'
    try {
      const adminId = req._id
      if (adminId) {
        const posts = await this.repository.getPostByAdminId(adminId);
        return res.json(posts);
      }
      return res.status(404).json({ message: 'Invalid admin' });

    }
    catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  delete = async (req: Request, res: Response) => {
     // #swagger.description = 'Deleter um post pelo id'
    try {
      const { id } = req.params;
      const isDeleted = await this.repository.deletePost(parseInt(id));
      if(isDeleted)
      {
        return res.status(204).json({ message: 'Post successfully removed' });
      }
      return res.status(404).json({ message: 'Post not found' })
      
    }
    catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  searchPosts = async (req: Request, res: Response) => {
     // #swagger.description = 'Buscar posts por uma palavra'
    try {
      const keyword = req.query.keyword?.toString().toLowerCase()
      if (keyword) {
        const posts = await this.repository.searchInPosts(keyword)
        return res.json(posts);
      }
      return res.status(404).json({ message: 'Post not found' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' })

    }
  }

}
