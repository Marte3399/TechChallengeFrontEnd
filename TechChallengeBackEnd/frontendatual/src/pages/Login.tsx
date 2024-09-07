import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', {
        name,
        password,
      });

      const token = response.data.token;

      // Armazena o token no localStorage
      localStorage.setItem('authToken', token);

      // Redireciona para a página de posts
      window.location.href = '/PostsPageAuth';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LoginContainer>
      <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome de Usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button disabled={(password === '' || name === '')} type="submit">
          Entrar
        </Button>
      </form>
    </LoginContainer>
  );
}

export default Login;
