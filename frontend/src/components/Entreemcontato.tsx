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
      axios
      .get(`http://localhost:3001/paroquias-nome/${paroquiaSelecionada.NomeParoquia}`)
        .then((response) => {
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
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="mensagem">Mensagem:</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Enviar</button>
            {enviado && <p>Feedback enviado com sucesso!</p>}
          </form>
          {paroquiaInfo && (
        <div className="paroquia-Informacoes">
            <p>{paroquiaInfo.NomeParoquia}</p>
            <p>Padres: {paroquiaInfo.Padres}</p>
            <p>CEP: {paroquiaInfo.CEP}</p>
            <p>Localização: {paroquiaInfo.LocalizacaoParoquia}</p>
            <p>Bairro: {paroquiaInfo.Bairro}</p>
            <p>
              Informações adicionais:{" "}
              {paroquiaInfo.InformacoesAdicionais}
            </p>
            <p>Contato email: {paroquiaInfo.EmailResponsavel}</p>
          </div>
        )}
        </div>
      </div>
  );
};

export default EntreEmContato;