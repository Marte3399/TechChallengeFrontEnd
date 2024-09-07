import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  background-color: #0f9aeb;
  color: white;
  justify-content: center;
  padding: 20px;
  &:hover {
    background-color: #ebb00f; /* Azul mais escuro no hover */
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Nav>
      <Link href="/">Home</Link>
      <Link href="/Login">
        <FaUser size={20} style={{ marginRight: 10, marginLeft: 10 }} />
        Login</Link>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
