import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ParoquiaModel from '../../../backend/src/models/paroquiaModel';

import '../styles/minha-paroquia.css';

const EscolhaParoquia: React.FC = () => {
  const [paroquias, setParoquias] = useState<ParoquiaModel[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // Função para buscar sugestões de paróquias com base no texto de entrada
  const fetchParoquias = async (searchText: string) => {
    if (searchText.trim() === '') {
      setParoquias([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/paroquias?s=${searchText}`);
      setParoquias(response.data);
    } catch (error) {
      console.error('Erro ao buscar sugestões de paróquias:', error);
    }
  };

  useEffect(() => {
    if (inputValue) {
      fetchParoquias(inputValue);
    } else {
      setParoquias([]);
    }
  }, [inputValue]);

  // Verifica se o valor inicial corresponde a uma opção disponível
  const initialOption = paroquias.find((option) => option.NomeParoquia === inputValue);

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container">
          <h1>Escolha sua Paróquia</h1>
          <p>Digite o nome da sua Paróquia:</p>
          <Autocomplete
            options={paroquias}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option.NomeParoquia}
            renderInput={(params) => <TextField {...params} label="Paróquia" variant="outlined" />}
            value={initialOption || null} // Define o valor inicial com base na verificação
          />
          <button>Buscar</button>
          <p>
            Não encontrou sua paróquia?
            <a href="/paroquia-cadastro">Cadastre aqui</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EscolhaParoquia;
