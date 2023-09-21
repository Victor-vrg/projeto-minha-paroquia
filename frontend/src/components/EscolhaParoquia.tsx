import React, { useState } from 'react';
import axios from 'axios';
import '../styles/minha-paroquia.css';

// Interface para descrever o formato dos dados das paróquias
interface Paroquia {
  ID: number;
  NomeParoquia: string;
}

function EscolhaParoquia() {
  const [nomeParoquia, setNomeParoquia] = useState('');
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [paroquiaNaoEncontrada, setParoquiaNaoEncontrada] = useState(false);

  const buscarParoquias = async () => {
    try {
      const response = await axios.post('http://localhost:3000/buscar-paroquia', { nomeParoquia });
      const data = response.data;
      setParoquias(data);

      if (data.length === 0) {
        setParoquiaNaoEncontrada(true);
      } else {
        setParoquiaNaoEncontrada(false);
      }
    } catch (error) {
      console.error('Erro ao buscar paróquia:', error);
    }
  };

  // Função para fechar o alerta
  const fecharAlerta = () => {
    setParoquiaNaoEncontrada(false);
  };

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container">
          <h1>Escolha sua Paróquia</h1>
          <p>Digite o nome da sua paróquia:</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              buscarParoquias();
            }}
          >
            <input
              type="text"
              placeholder="Nome da Paróquia"
              value={nomeParoquia}
              onChange={(e) => setNomeParoquia(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
          {paroquias.length > 0 && (
            <ul>
              {paroquias.map((paroquia) => (
                <li key={paroquia.ID}>{paroquia.NomeParoquia}</li>
              ))}
            </ul>
          )}
          {paroquiaNaoEncontrada && (
            <div className="alerta">
              <p>OPS! Paróquia não encontrada.</p>
              <div>
                <button onClick={fecharAlerta}>Cancelar</button>
                <a href="https://www.google.com.br/">
                  <button>Solicitar</button>
                </a>
              </div>
            </div>
          )}
          <p>
            Não encontrou sua paróquia?{' '}
            <a href="https://www.google.com.br/">Cadastre aqui</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EscolhaParoquia;
