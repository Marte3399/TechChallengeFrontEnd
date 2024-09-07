import { Router, Request, Response } from 'express';
import { AppDataSource } from "../../database/data-source";
import { PostController } from '../controllers/post.controller';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { authMiddleware } from '../middleware/auth';
import { PostRepository } from '../repositories/post.repository';

const router = Router();

router.post('/login', new UserController(new UserRepository()).login);
router.get('/teste', authMiddleware,new UserController(new UserRepository()).teste);

router.get('/posts', new PostController(new PostRepository()).read);

router.get('/posts/admin', authMiddleware,new PostController(new PostRepository()).readAdmin);

router.get('/posts/search/', new PostController(new PostRepository()).searchPosts)

router.get('/posts/:id', new PostController(new PostRepository()).readId);

router.post('/posts', authMiddleware,new PostController(new PostRepository()).create);

router.put('/posts/:id', authMiddleware,new PostController(new PostRepository()).update);

router.delete('/posts/:id', authMiddleware,new PostController(new PostRepository()).delete);


export default router;