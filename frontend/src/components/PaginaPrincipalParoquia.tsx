import React from 'react';
import Header from '../components/Header'; // Importe o componente Header
//import Navegacao from '../components/Navegacao'; // Crie o componente de navegação (Navegacao.js ou Navegacao.tsx)
//import Content from '../components/Content'; // Crie o componente de conteúdo principal (Content.js ou Content.tsx)
import Footer from '../components/footer';
import ParoquiaModel from '../../../backend/src/models/paroquiaModel';

interface PaginaPrincipalParoquiaProps {
    paroquiaSelecionada: ParoquiaModel | null;
  }
  
  const PaginaPrincipalParoquia: React.FC<PaginaPrincipalParoquiaProps> = ({ paroquiaSelecionada }) => {
  return (
    <div>
      <Header />
      
     
      <Footer />
    </div>
  );
};

export default PaginaPrincipalParoquia;
