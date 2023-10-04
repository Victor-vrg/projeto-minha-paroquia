import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ParoquiaModel from '../../../backend/src/models/paroquiaModel';
import { useNavigate } from 'react-router-dom'; // Importe o useNavigate
import '../styles/minha-paroquia.css';

interface EscolhaParoquiaProps {
  setParoquiaSelecionada: React.Dispatch<React.SetStateAction<ParoquiaModel | null>>;
}

const EscolhaParoquia: React.FC<EscolhaParoquiaProps> = ({ setParoquiaSelecionada }) => {
  const [paroquias, setParoquias] = useState<ParoquiaModel[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const navigate = useNavigate(); 

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

  // Função para redirecionar para a página principal da paróquia
  const redirectToPaginaPrincipal = () => {
    if (initialOption) {
      navigate('/pagina-principal-paroquia'); 
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container">
          <h1>Escolha sua Paróquia</h1>
          <p>Digite o nome da sua Paróquia:</p>
          <Autocomplete id='autocomplete'
            options={paroquias}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option.NomeParoquia}
            renderInput={(params) => <TextField {...params} label="Paróquia" variant="outlined" />}
            value={initialOption || null} // Define o valor inicial com base na verificação
          />
          <button onClick={redirectToPaginaPrincipal}>Buscar</button> {/* Adicione um evento de clique */}
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

