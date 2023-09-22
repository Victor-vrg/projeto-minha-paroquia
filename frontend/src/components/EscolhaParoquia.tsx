import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';  para quando tiver mais paroquia com dados proprios//
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import '../styles/minha-paroquia.css';

function EscolhaParoquia() {
  const [paroquia, setParoquia] = useState('');
  const [sugestoes, setSugestoes] = useState<string[]>([]);
//  const navigate = useNavigate();//

  const buscarSugestoes = (inputValue: string) => {
    if (inputValue) {
      axios
        .get(`http://localhost:3000/api/paroquias?nome=${inputValue}`)
        .then((response) => {
          const nomesParoquias = response.data;
          setSugestoes(nomesParoquias);
        })
        .catch((error) => {
          console.error('Erro ao buscar nomes de paróquias:', error);
        });
    }
  };

  useEffect(() => {
    buscarSugestoes(paroquia);
  }, [paroquia]);

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container">
          <h1>Escolha sua Paróquia</h1>
          <p>Digite o nome da sua Paróquia:</p>
          <Autocomplete
            id="paroquia-autocomplete"
            options={sugestoes}
            freeSolo
            onInputChange={(e, newValue) => {
              setParoquia(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nome da Paróquia"
                variant="outlined"
              />
            )}
          />
          <button>Buscar</button>
          <ul>
            {sugestoes.map((sugestao, index) => (
              <li key={index}>{sugestao}</li>
            ))}
          </ul>
          <p>
            Não encontrou sua paróquia?
            <a href="/paroquia-cadastro">Cadastre aqui</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EscolhaParoquia;
