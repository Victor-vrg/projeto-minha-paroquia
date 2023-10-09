import React, { useState } from 'react';
import SwiperCore from 'swiper'
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import '../styles/carrossel.css'; 

SwiperCore.use([Navigation, Pagination]);

interface Evento {
    ID: number;
    NomeEvento: string;
    DataInicio: string;
    DataFim: string;
    HoraInicio: string;
    HoraFim: string;
    LocalizacaoEvento: string;
    DescricaoEvento: string;
    CaminhoImagem: string; 
    TipoEvento: string;
    Participacao: 'Sim' | 'Talvez' | 'Não';
    Destaque: number;
    ParoquiaID: number;
}

interface CarrosselProps {
  titulo: string;
  eventos: Evento[];
}

const Carrossel: React.FC<CarrosselProps> = ({ titulo, eventos }) => {
  const [activeSlide, setActiveSlide] = useState<number | undefined>(undefined);

  return (
    <div className="carrossel-container">
      <h2 className="carrossel-titulo">{titulo}</h2>
      <Swiper
  spaceBetween={16}
  slidesPerView={1} 
  navigation
  pagination={{ clickable: true }}
  onSlideChange={(swiper: SwiperCore) => {
    setActiveSlide(swiper.activeIndex);
  }}
  breakpoints={{
    600: {
      slidesPerView: 2, 
    },
    840: {
      slidesPerView: 3, 
    },
  }}
      >
        {eventos.map((evento, index) => (
          <SwiperSlide key={evento.ID}>
            <div
              className={`carrossel-item ${
                index === activeSlide ? 'active' : ''
              }`}
              onClick={() => {
                setActiveSlide(index === activeSlide ? undefined : index);
              }}
            >
              <img
                 src={evento.CaminhoImagem}
                alt={evento.NomeEvento}
                className="carrossel-imagem"
              />
              <div className="carrossel-info">
                <h3>{evento.NomeEvento}</h3>
                <p>{evento.DataInicio} {evento.DataFim} {evento.HoraInicio} {evento.HoraInicio}</p>
                <p>{evento.LocalizacaoEvento}</p>
                {index === activeSlide && (
                  <div className="carrossel-descricao">
                    <p>{evento.DescricaoEvento}</p>
                    <button className="participacao-button">
                      Participação: {evento.Participacao}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carrossel;
