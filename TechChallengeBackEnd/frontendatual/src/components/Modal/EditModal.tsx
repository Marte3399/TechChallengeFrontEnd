// components/EditPostModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 80vh;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 50vh;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #3366f1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #00b7ff;
  }
`;

const BackButton = styled.button`
  background-color: #3366f1; /* Azul */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #00b7ff; /* Azul mais escuro */
  }
`;

const DeleteButton = styled(Button)`
  background-color: #d32f2f; /* Vermelho */
  &:hover {
    background-color: #5e0707;
  }
`;

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: number;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState({ title: '', description: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:4000/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data);
      };

      fetchPost();
    }
  }, [postId]);

  const handleUpdate = async () => {
    if (post.description.length > 2000) {
      setErrorMessage('A descrição não pode exceder 2000 caracteres.');
      return;
    }
    try {
      if (window.confirm('Você realmente deseja atualizar este post?')) {
        const token = localStorage.getItem('authToken');
        await axios.put(`http://localhost:4000/posts/${postId}`, post, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Post atualizado com sucesso!');
        onClose();
        router.push('/PostsPageAuth');
      }
    } catch (err) {
      console.error('Erro ao atualizar o post:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Você realmente deseja excluir este post?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`http://localhost:4000/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Post excluído com sucesso!');
        onClose(); // Fechar o modal após a exclusão
        router.push('/PostsPageAuth');
      } catch (err) {
        console.error('Erro ao excluir o post:', err);
      }
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    if (newDescription.length > 2000) {
      setErrorMessage('A descrição não pode exceder 2000 caracteres.');
    } else {
      setErrorMessage('');
    }
    setPost({ ...post, description: newDescription });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <h2 className="text-center text-2xl font-bold mb-4">Editar Post</h2>
        <Input
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="Título"
        />
        <TextArea
          rows={5}
          value={post.description}
          onChange={(e) => setPost({ ...post, description: e.target.value })}
          placeholder="Descrição"
          maxLength={2000}
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Button onClick={handleUpdate} disabled={!!errorMessage}>Atualizar</Button>
        <DeleteButton onClick={handleDelete}>Excluir</DeleteButton>
        <BackButton onClick={onClose}>Fechar</BackButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditPostModal;
