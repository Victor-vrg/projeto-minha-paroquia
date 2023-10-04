import React from 'react';
import Header from '../components/Header';
import NavigationBar from './NavigationBar';

import Footer from '../components/footer';
import ParoquiaModel from '../../../backend/src/models/paroquiaModel';


interface PaginaPrincipalParoquiaProps {
  paroquiaSelecionada: ParoquiaModel | null;
}

const PaginaPrincipalParoquia: React.FC<PaginaPrincipalParoquiaProps> = ({ paroquiaSelecionada }) => {
  return (
    <div>
      <Header />
      <NavigationBar />

      <Footer />
    </div>
  );
};

export default PaginaPrincipalParoquia;
