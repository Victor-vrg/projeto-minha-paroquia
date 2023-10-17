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
        <div className="form">
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="input-group">
              <input className="inputs"
                type="text"
                placeholder="Nome:"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <input className="inputs"
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