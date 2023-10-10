import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Header from '../components/Header';
import NavigationBar from './NavigationBar';
import Footer from '../components/footer';
import Carrossel from '../components/Carrossel'; 
import ParoquiaModel from '../../../backend/src/models/paroquiaModel';
import EventosModel from '../../../backend/src/models/eventosModel'; 

interface PaginaPrincipalParoquiaProps {
  paroquiaSelecionada: ParoquiaModel | null;
}

const PaginaPrincipalParoquia: React.FC<PaginaPrincipalParoquiaProps> = ({ paroquiaSelecionada }) => {
  const [eventos, setEventos] = useState<EventosModel[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/eventos/eventos') 
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos:', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <NavigationBar />
      <Carrossel titulo="Eventos" eventos={eventos} />
      <Footer />
    </div>
  );
};

export default PaginaPrincipalParoquia;

