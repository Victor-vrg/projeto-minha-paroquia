import React, { useState, useEffect } from "react";
import axios from "axios";
import ParoquiaModel from "../../../backend/src/models/paroquiaModel";
import '../styles/Entreemcontato.css'

interface EntreEmContatoProps {
  paroquiaSelecionada: ParoquiaModel | null; // Certifique-se de que a paróquia seja passada como prop
}


const EntreEmContato: React.FC<EntreEmContatoProps> = ({
  paroquiaSelecionada,
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [enviado, setEnviado] = useState(false);

  const [paroquiaInfo, setParoquiaInfo] = useState<ParoquiaModel | null>(null);
  console.log('Valor de paroquiaInfo:', paroquiaInfo);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (paroquiaSelecionada) {
      console.log('Nome da paróquia:', paroquiaSelecionada.NomeParoquia);
      axios.get(`http://localhost:3001/api/paroquias-nome/${paroquiaSelecionada.NomeParoquia}`)
        .then((response) => {
          console.log('Resposta do servidor:', response.data);
          setParoquiaInfo(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar informações da paróquia:", error);
        });
    }
  }, [paroquiaSelecionada]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enviar os dados do formulário para o servidor
    axios
      .post("URL_DO_BACKEND_PARA_ENVIAR_FEEDBACK", formData)
      .then((response) => {
        setEnviado(true);
      })
      .catch((error) => {
        console.error("Erro ao enviar feedback:", error);
      });
  };

  return (
    
    <div className="entre-em-contato">
      <h2>Entre em Contato</h2>
      {window.innerWidth > 1024 && paroquiaInfo && ( 
      <p> 
        Localização: {paroquiaInfo.LocalizacaoParoquia}, {paroquiaInfo.Bairro}, {paroquiaInfo.CEP}
      </p>
    )}
      <iframe 
      className="mapa"
        title="Mapa da Paróquia"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.5461755643496!2d-44.03463425275737!3d-19.943520233759035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa695e5f8be9079%3A0x10da2c4429defb98!2sPar%C3%B3quia%20Santa%20Maria%20Rainha%20dos%20Ap%C3%B3stolos!5e0!3m2!1spt-PT!2sbr!4v1697569230904!5m2!1spt-PT!2sbr"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
        <div className="form">
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="input-group">
              <input className="input-form"
                type="text"
                placeholder="Nome:"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <input className="input-form"
                type="email"
                id="email"
                name="email"
                placeholder="E-mail:"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <textarea className="caixa-de-mensagem"
                id="mensagem"
                name="mensagem"
                placeholder="Mensagem:"
                value={formData.mensagem}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Enviar</button>
            {enviado && <p>Feedback enviado com sucesso!</p>}
          </form>
          {paroquiaInfo && (
        <div className="paroquia-Informacoes">
          <p>
              {" "}
              {paroquiaInfo.InformacoesAdicionais}
            </p>
            <p>{paroquiaInfo.NomeParoquia}</p>
            <p>Localização: {paroquiaInfo.LocalizacaoParoquia}, {paroquiaInfo.Bairro}, {paroquiaInfo.CEP}</p>
            <p>Padres: {paroquiaInfo.Padres}</p>
            <p>Contatos: {paroquiaInfo.EmailResponsavel}</p>
          </div>
        )}
        </div>
      </div>
   
  );
};

export default EntreEmContato;