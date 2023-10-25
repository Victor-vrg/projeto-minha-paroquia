import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/footer';
import Carrossel from '../components/Carrossel';  
import CarrosselExcursao from '../components/CarrosselExcursao';  
import EntreEmContato from '../components/Entreemcontato';
import FeedbackBanner from '../components/feedbackBanner';
import ParoquiaModel from '../../../backend/src/models/paroquiaModel';
import EventosModel from '../../../backend/src/models/eventosModel';
import ExcursaoModel from '../../../backend/src/models/ExcursaoModel';
import NavigationBar from './NavigationBar'; // Importe o NavigationBar

interface PaginaPrincipalParoquiaProps {
  paroquiaSelecionada: ParoquiaModel | null;
}

const PaginaPrincipalParoquia: React.FC<PaginaPrincipalParoquiaProps> = ({ paroquiaSelecionada }) => {
  const [eventos, setEventos] = useState<EventosModel[]>([]);
  const [excursao, setExcursao] = useState<ExcursaoModel[]>([]);
  const location = useLocation();

  const nomeParoquia = location.state?.nomeParoquia || localStorage.getItem('paroquiaSelecionada') || '';

  useEffect(() => {
    axios.get(`http://localhost:3001/eventos/eventos`)
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos:', error);
      });

    axios.get(`http://localhost:3001/excursao/excursao`)
      .then((response) => {
        setExcursao(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar excursões:', error);
      });
  }, [nomeParoquia]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <FeedbackBanner />
      <Header nomeParoquia={nomeParoquia} />
      <div id="eventos">
        <Carrossel titulo="Eventos" eventos={eventos} />
      </div>
      <div id="excursao">
        <CarrosselExcursao titulo="Excursões" excursao={excursao} />
      </div>
      <div id="entre-em-contato">
        <EntreEmContato paroquiaSelecionada={paroquiaSelecionada} />
      </div>
      <NavigationBar
        onEventosClick={() => scrollToSection("eventos")}
        onExcursaoClick={() => scrollToSection("excursao")}
        onContatoClick={() => scrollToSection("entre-em-contato")}
      />
      <Footer />
    </div>
  );
};

export default PaginaPrincipalParoquia;
