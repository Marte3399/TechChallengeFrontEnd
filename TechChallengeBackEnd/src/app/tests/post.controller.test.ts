
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
import supertest from 'supertest';
import app from '../../app';
import { title } from 'process';
import { AppDataSource } from '../../database/data-source';
let token = ""
beforeAll(async () => {
  await AppDataSource.initialize();
  const userRepository = new UserRepository()
  userRepository.insertNewUser("userTeste", "passTeste")
  const res = await supertest(app).post(`/login`).send({username: "userTeste", passworld:"passTeste"});
  token = res.body.token
});

afterAll(async () => {
  await AppDataSource.destroy();
  
});

describe('PostController', () => {
  // Run your tests here
  const repository = new PostRepository()
  describe('Ler todos os posts', () => {
    it('lista de post', async () => {
        const newPost = await repository.createPost({
            title: 'lista de post',
            description: 'Description of Test Post 1',
            user: {id:1},
          })
      const response = await supertest(app).get('/posts');
      expect(response.status).toBe(200);
    });
  });

  describe('Ler um post', () => {
    it('Buscar um post que existe', async () => {
      const newPost = await repository.createPost({
        title: 'buscar um post',
        description: 'Description of Test Post 1',
        user: {id:1},
      })
      const response = await supertest(app).get(`/posts/${newPost.id}`);
      expect(response.status).toBe(200);
      expect(response.body.description).toEqual(newPost.description);
      expect(response.body.id).toEqual(newPost.id);
      expect(response.body.title).toEqual(newPost.title);
    });

    it('Buscar um post não existe', async () => {
        const response = await supertest(app).get(`/posts/9999`);
        expect(response.status).toBe(404);
      });
  });

  describe('Criar post', () => {
    it('Criar novo post com sucesso', async () => {
        const newPost = {
            title: 'create',
            description: 'Description of Test Post 1',
            user: {id:1},
          }
      const response = (await supertest(app).post(`/posts`).set('Authorization', 'Bearer ' + token).send(newPost))

      expect(response.status).toBe(201);
    });
    it('Criar novo post sem titulo', async () => {
        const newPost = {
            description: 'Description of Test Post 1',
            user: {id:1},
          }
      const response = (await supertest(app).post(`/posts`).set('Authorization', 'Bearer ' + token).send(newPost))

      expect(response.status).toBe(400);
    });
    it('Criar novo post sem descricão', async () => {
        const newPost = {
            title: 'Titulo',
            user: {id:1},
          }
      const response = (await supertest(app).post(`/posts`).set('Authorization', 'Bearer ' + token).send(newPost))

      expect(response.status).toBe(400);
    });
  });

  describe('update', () => {
    it('Atualizar um post com sucesso', async () => {
        const newPost = await repository.createPost({
            title: 'atualizar um post',
            description: 'Description of Test Post 1',
            user: {id:1},
          })
      // Dados para atualização
      const updatedData = {
        title: 'Updated Test Post 3',
        description: 'Updated Description of Test Post 3',
        author: 'Updated Test Author 3',
      };
      const response = await supertest(app).put(`/posts/${newPost.id}`).set('Authorization', 'Bearer ' + token).send(updatedData);

      expect(response.status).toBe(200);
    });

    it('Atualizar um post sem titulo', async () => {
      const updatedData = {
        description: 'Updated Description of Test Post 3',
        author: 'Updated Test Author 3',
      };
      const response = await supertest(app).put(`/posts/999`).set('Authorization', 'Bearer ' + token).send(updatedData);

      expect(response.status).toBe(400);
    });
    it('Atualizar um post sem descricao', async () => {
        const updatedData = {
          title: 'Titulo',
          author: 'Updated Test Author 3',
        };
        const response = await supertest(app).put(`/posts/999`).set('Authorization', 'Bearer ' + token).send(updatedData);
  
        expect(response.status).toBe(400);
      });
    it('Atualizar um post que nao existe', async () => {
      const updatedData = {
        title: 'Updated Test Post 3',
        description: 'Updated Description of Test Post 3',
        author: 'Updated Test Author 3',
      };
      const response = await supertest(app).put(`/posts/99999`).set('Authorization', 'Bearer ' + token).send(updatedData);

      expect(response.status).toBe(404);
    });
    it('Atualizar um post sem autenticacao', async () => {
        const response = await supertest(app).put(`/posts/99999`)
        expect(response.status).toBe(401);
      });

    it('Atualizar um post com token invalido', async () => {
        const response = await supertest(app).put(`/posts/99999`).set('Authorization', 'Bearer ' + "invalido")
        expect(response.status).toBe(403);
      });
  });

  describe('Deletar post', () => {
    it('Deletar um post que existe', async () => {
        const newPost = await repository.createPost({
            title: 'post que vai ser deletado',
            description: 'Description of Test Post 1',
            user: {id:1},
          })

      const response = await supertest(app).delete(`/posts/${newPost.id}`).set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(204);
      const deletedPost = await repository.getPostById(newPost.id || 1);
      expect(deletedPost).toBeNull();
    });

    it('Deletar um post que não existe', async () => {
      const response = await supertest(app).delete(`/posts/${999}`).set('Authorization', 'Bearer ' + token);
      expect(response.status).toBe(404);
    });
    it('Deletar um post sem autenticacao', async () => {
        const response = await supertest(app).delete(`/posts/${999}`)
        expect(response.status).toBe(401);
      });

    it('Deletar um post com token invalido', async () => {
        const response = await supertest(app).delete(`/posts/${999}`).set('Authorization', 'Bearer ' + "token invalido");
        expect(response.status).toBe(403);
      });
  });
});