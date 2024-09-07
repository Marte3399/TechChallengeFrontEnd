
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import EditPostModal from '@/components/Modal/EditModal';
import NewPostModal from '@/components/Modal/NewPostModal';
import SelectPostModal from '@/components/Modal/SelectModal';

interface Post {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  user: {
    id: number;
    username: string;
  };
}

const PostItem = styled.li`
  border: 1px solid #ddd; /* Borda leve ao redor de cada post */
  border-radius: 8px; /* Canto arredondado */
  padding: 20px; /* Espaçamento interno */
  margin-bottom: 20px; /* Espaçamento entre os posts */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil para destaque */
  background-color: #fff; /* Fundo branco para contraste */
  display: flex; /* Mantém os itens flexíveis */
  align-items: center; /* Alinha os itens verticalmente ao centro */
`;

const PostImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px; /* Espaçamento entre a imagem e o conteúdo */
`;

const PostContent = styled.div`
  flex: 1; /* Faz com que o conteúdo ocupe o espaço disponível */
  display: flex;
  flex-direction: column; /* Coloca o título, descrição e autor em coluna */
  margin-right: 20px; /* Espaçamento entre o conteúdo e os botões */
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a73e8; /* Azul mais profissional */
  margin-bottom: 10px;
  word-break: break-word; /* Quebra o texto em palavras longas */
  white-space: normal; /* Permite que o texto quebre em várias linhas */
  overflow-wrap: break-word; /* Quebra palavras longas */
`;

const PostDescription = styled.p`
  color: #666; /* Texto cinza para descrição */
  margin-bottom: 10px;
  word-break: break-word; /* Quebra o texto em palavras longas */
  white-space: normal; /* Permite que o texto quebre em várias linhas */
  overflow-wrap: break-word; /* Quebra palavras longas */
`;

const PostAuthor = styled.p`
  color: #333; /* Texto cinza mais escuro para autor */
  font-weight: bold;
  word-break: break-word; /* Quebra o texto em palavras longas */
  white-space: normal; /* Permite que o texto quebre em várias linhas */
  overflow-wrap: break-word; /* Quebra palavras longas */
`;

const PostActions = styled.div`
  display: flex;
  flex-direction: column; /* Coloca os botões em coluna */
  align-items: flex-end; /* Alinha os botões à direita */
  gap: 10px; /* Espaçamento entre os botões */
  width: 114px;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 100%;
  max-width: 100%;
  border: 1px solid #ccc; /* Cinza mais suave */
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f9f9f9; /* Fundo branco suave */
  color: #333; /* Texto cinza escuro */
`;

const Button = styled.button`
  padding: 5px 30px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonSearch = styled.button`
  padding: 5px 30px;
  margin: 5px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const NewPostButton = styled(Button)`
  background-color: #27881e; /* Azul mais suave */
  padding: 5px 100px;
  margin: 5px;
  color: white;
  &:hover {
    background-color: #50c005; /* Azul mais escuro no hover */
  }
`;

const EditButton = styled(Button)`
  background-color: #3366f1; /* Amarelo mais suave */
  color: white;
  &:hover {
    background-color: #00b7ff; /* Amarelo mais escuro no hover */
  }
`;

const SelectButton = styled(Button)`
  background-color: #e0e0de; /* Amarelo mais suave */
  color: white;
  &:hover {
    background-color: #f5ce4d; /* Amarelo mais escuro no hover */
  }
`;

const DeleteButton = styled(Button)`
  background-color: #d32f2f; /* Vermelho mais suave */
  color: white;
  &:hover {
    background-color: #5e0707; /* Vermelho mais escuro no hover */
  }
`;

const PostsPageAuth = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState(''); // Novo estado para o título
  const [newPostDescription, setNewPostDescription] = useState(''); // Novo estado para a descrição

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    document.body.style.backgroundColor = '#5f7077';
    return () => {
      document.body.style.backgroundColor = '';
    if (!token) {
      router.push('/login');
      return;
    }

    fetchPosts();  };
  }, [router]);

  const fetchPosts = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:4000/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      router.push('/login');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:4000/posts/search', {
        params: {
          keyword: searchQuery, // Altere de 'query' para 'keyword'
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('authToken');
    const confirmDelete = window.confirm('Deseja mesmo excluir esta postagem?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const openCreateModal = () => {  
    setNewPostTitle('');
    setNewPostDescription(''); // Limpa a descrição
    setIsCreateModalOpen(true)
  };
  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  };

  const openEditModal = (id: number) => {
    setSelectedPostId(id);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedPostId(null);
    setIsEditModalOpen(false);
  };

  const openSelectModal = (id: number) => {
    setSelectedPostId(id);
    setIsSelectModalOpen(true);
  };

  const closeSelectModal = () => {
    setSelectedPostId(null);
    setIsSelectModalOpen(false);
  };
  return (
    <div className="container mx-auto p-4">
      <Header />
      <div className="flex justify-between items-center mb-4 mt-4">
        <h1 className="text-2xl font-bold">Todas Postagens Administrativas</h1>
      </div>
      <form onSubmit={handleSearch} className="flex mb-4">
        <SearchInput
          type="text"
          placeholder="Buscar postagens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <ButtonSearch type="submit">
            <FaSearch />
          </ButtonSearch>
        </div>
      </form>
      <div className="flex mb-4">
        <div className="ml-auto">   
            <NewPostButton onClick={openCreateModal}>
              <FaPlus className="mr-2" /> Novo
            </NewPostButton>
        </div>
      </div>
      <ul>
        {posts.map((post) => (
          <PostItem key={post.id}>
            {post.imageUrl && (
              <PostImage src={post.imageUrl} alt={post.title} />
            )}
            <PostImage src="https://via.placeholder.com/150" alt="Placeholder Image" />
            <PostContent>
              <SelectButton onClick={() => openSelectModal(post.id)}>
                <PostTitle>{post.title}</PostTitle>
              </SelectButton>
              <PostDescription>
                {post.description.length > 300 
                  ? `${post.description.substring(0, 300)}...` 
                  : post.description}
              </PostDescription>
              <PostAuthor>Autor: {post.user.username}</PostAuthor>
            </PostContent>              
            <PostActions>
                <EditButton onClick={() => openEditModal(post.id)}>
                  <FaEdit /> Editar
                </EditButton>
                <DeleteButton onClick={() => handleDelete(post.id)}>
                  <FaTrashAlt /> Excluir
                </DeleteButton>
              </PostActions>
          </PostItem>
        ))}
      </ul>
      <Footer />
      <NewPostModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal} 
        onPostCreated={fetchPosts} 
        title={newPostTitle}
        description={newPostDescription}
        setTitle={setNewPostTitle}
        setDescription={setNewPostDescription}
      />
      {selectedPostId && (
        <SelectPostModal
          isOpen={isSelectModalOpen}
          onClose={closeSelectModal}
          postId={selectedPostId}
        />
      )}
      {selectedPostId && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          postId={selectedPostId}
        />
      )}
    </div>
  );
};

export default PostsPageAuth;
