import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import NavigationBar from './NavigationBar';
import Footer from '../components/footer';
import Carrossel from '../components/Carrossel';  
import CarrosselExcursao from '../components/CarrosselExcursao';  
import ParoquiaModel from '../../../backend/src/models/paroquiaModel';
import EventosModel from '../../../backend/src/models/eventosModel';
import ExcursaoModel from '../../../backend/src/models/excursaoModel';

interface PaginaPrincipalParoquiaProps {
  paroquiaSelecionada: ParoquiaModel | null;
}

const PaginaPrincipalParoquia: React.FC<PaginaPrincipalParoquiaProps> = ({ paroquiaSelecionada }) => {
  const [eventos, setEventos] = useState<EventosModel[]>([]);
  const [excursao, setExcursao] = useState<ExcursaoModel[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/eventos/eventos')
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos:', error);
      });

    axios.get('http://localhost:3001/excursao/excursao')
      .then((response) => {
        setExcursao(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar excursões:', error);
      });
  }, []);

  return (
    <div>
      <Header />
      <Carrossel titulo="Eventos" eventos={eventos} /> 
      <CarrosselExcursao titulo="Excursões" excursao={excursao} />
      <NavigationBar />
      <Footer />
    </div>
  );
};

export default PaginaPrincipalParoquia;
