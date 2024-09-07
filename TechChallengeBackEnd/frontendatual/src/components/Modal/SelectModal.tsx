// components/SelectModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
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
  overflow: auto; /* Permite rolagem se necessário */
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
  background-color: #f8f9fa; // Adiciona uma cor de fundo para indicar que é somente leitura
  pointer-events: none; // Impede a interação do usuário
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 50vh;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f8f9fa; // Adiciona uma cor de fundo para indicar que é somente leitura
  overflow: scroll; /* Permite rolagem dentro do textarea */
  resize: vertical; /* Permite o redimensionamento vertical */
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #ffa600;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const BackButton = styled.button`
  background-color: #007bff; /* Azul */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3; /* Azul mais escuro */
  }
`;

interface SelectPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: number;
}

const SelectPostModal: React.FC<SelectPostModalProps> = ({ isOpen, onClose, postId }) => {
  const [post, setPost] = useState({ title: '', description: '' });
 
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/posts/${postId}`);
          setPost(response.data);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
      fetchPost();
    }
  }, [postId]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <h2 className="text-center text-2xl font-bold mb-4">Detalhes do Post</h2>
        <Input
          type="text"
          value={post.title}
          placeholder="Título"
        />
        <TextArea
          rows={5}
          value={post.description}
          placeholder="Descrição"
          maxLength={2000}
        />
        <BackButton onClick={onClose}>Fechar</BackButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SelectPostModal;
