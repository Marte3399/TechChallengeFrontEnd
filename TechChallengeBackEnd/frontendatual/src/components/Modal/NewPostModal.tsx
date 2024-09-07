import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 80vh;
  height: 50vh;
  z-index: 1000;
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
  height: 30vh;
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const NewPostModal: React.FC<NewPostModalProps> = ({ 
  isOpen, 
  onClose, 
  onPostCreated,
  title,
  description,
  setTitle,
  setDescription,
}) => {
  //const [title, setTitle] = useState('');
  //const [description, setDescription] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    if (newDescription.length > 2000) {
      setErrorMessage('A descrição não pode exceder 2000 caracteres.');
    } else {
      setErrorMessage('');
    }
    setDescription(newDescription);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (description.length > 2000) {
      setErrorMessage('A descrição não pode exceder 2000 caracteres.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await axios.post(
        'http://localhost:4000/posts',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Postagem criada com sucesso!');
      onPostCreated(); // Atualiza a lista de posts após a criação
      onClose(); // Fecha a modal após a criação
    } catch (error) {
      console.error('Erro ao criar a postagem:', error);
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2 className="text-center text-2xl font-bold mb-4">Nova Postagem</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextArea
            placeholder="Descrição"
            value={description}
            maxLength={2000}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Button type="submit" disabled={!!errorMessage}>Criar Postagem</Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default NewPostModal;
