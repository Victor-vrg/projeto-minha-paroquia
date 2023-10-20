import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/cadastroUsuario.css";

function CadastroUsuario() {
  const [dados, setDados] = useState({
    NomeCompleto: "",
    Email: "",
    Telefone: "",
    ServicosComunitario: "",
    Bairro: "",
    ParoquiaMaisFrequentada: "",
    DataNascimento: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Enviar os dados de cadastro para o backend
      const response = await axios.post(
        "http://localhost:3001/usuarios/cadastrar",
        dados
      );
      console.log("Cadastro bem-sucedido:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      // Lógica para lidar com erros, como exibir uma mensagem de erro para o usuário
    }
  };

  return (
    <div className="cadastro-user">
      <div className="cadastro-container">
        <div className="cadastro-central">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            <h2>Cadastro de Usuário</h2>

            <label htmlFor="NomeCompleto">Nome Completo:</label>
            <input
              type="text"
              id="NomeCompleto"
              name="NomeCompleto"
              value={dados.NomeCompleto}
              onChange={handleChange}
              required
            />

            <label htmlFor="Email">E-mail:</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={dados.Email}
              onChange={handleChange}
              required
            />

            <label htmlFor="Telefone">Celular ou Telefone:</label>
            <input
              type="tel"
              id="Telefone"
              name="Telefone"
              value={dados.Telefone}
              onChange={handleChange}
              required
            />
            <label htmlFor="ServicosComunitario">Serviço Comunitário:</label>
          <input
            type="text"
            id="ServicosComunitario"
            name="ServicosComunitario"
            value={dados.ServicosComunitario}
            onChange={handleChange}
            placeholder="Atividades que desempenha na comunidade, Exemplos: Catequista, Cantor..."
            multiple
            required
          />
  
            <label htmlFor="Bairro">Bairro:</label>
            <input
              type="text"
              id="Bairro"
              name="Bairro"
              value={dados.Bairro}
              onChange={handleChange}
              required
            />

            <label htmlFor="ParoquiaMaisFrequentada">
              Paróquia mais Frequentada:
            </label>
            <input
              type="text"
              id="ParoquiaMaisFrequentada"
              name="ParoquiaMaisFrequentada"
              value={dados.ParoquiaMaisFrequentada}
              onChange={handleChange} 
              required
            />

            <label htmlFor="DataNascimento">Data de Nascimento:</label>
            <input
              type="date"
              id="DataNascimento"
              name="DataNascimento"
              value={dados.DataNascimento}
              onChange={handleChange}
              required
            />

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuario;
