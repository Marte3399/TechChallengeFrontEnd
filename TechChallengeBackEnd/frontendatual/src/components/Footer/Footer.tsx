import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #0f9aeb;
  color: white;
  text-align: center;
  padding: 10px 0;
  bottom: 0;
  width: 100%;
  justify-content: center;
  display: flex;
  padding: 20px;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>Direitos autorais © 2024</p>
    </FooterContainer>
  );
};

export default Footer;
