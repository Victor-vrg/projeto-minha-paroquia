import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { useNavigate } from 'react-router-dom';
import '../styles/cadastroUsuario.css';

function CadastroUsuario() {
  const [dados, setDados] = useState({
    NomeCompleto: '',
    Email: '',
    Telefone: '',
    ServicosComunitario: '',
    Bairro: '',
    ParoquiaMaisFrequentada: '', // Nome da paróquia selecionada
    DataNascimento: '',
    IDServicoComunitario: [] as number[],
    senha: '',
  });

  const [servicosComunitariosOptions, setServicosComunitariosOptions] = useState([]);
  const [selectedServicosComunitarios, setSelectedServicosComunitarios] = useState([] as MultiValue<any>);
  const [paroquiaOptions, setParoquiaOptions] = useState<Array<{ value: number; label: string }>>([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleParoquiaInputChange = (inputValue: string) => {
    // Atualizar as opções de paróquias com base no texto de entrada
    if (inputValue.trim() === '') {
      setParoquiaOptions([]);
    } else {
      fetchParoquias(inputValue);
    }
  };

  const fetchServicosComunitarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/usuarios/servicos-comunitarios');
      const options = response.data.map((servicoComunitario: any) => ({
        value: servicoComunitario.ID,
        label: servicoComunitario.ServicoComunitario,
      }));
      setServicosComunitariosOptions(options);
    } catch (error) {
      console.error('Erro ao buscar serviços comunitários:', error);
    }
  };

  const fetchParoquias = async (searchText: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/paroquias?s=${searchText}`);
      const options = response.data.map((paroquia: any) => ({
        value: paroquia.ID,
        label: paroquia.NomeParoquia,
      }));
      setParoquiaOptions(options);
    } catch (error) {
      console.error('Erro ao buscar sugestões de paróquias:', error);
    }
  };

  useEffect(() => {
    fetchServicosComunitarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (dados.DataNascimento > today) {
      alert('A data de nascimento não pode ser no futuro.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/usuarios/cadastrar', dados);
      console.log('Cadastro bem-sucedido:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  }

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

            <label htmlFor="ParoquiaMaisFrequentada">Paróquia mais Frequentada:</label>
            <Select className='select-input'
              options={paroquiaOptions}
              onInputChange={handleParoquiaInputChange}
              value={paroquiaOptions.find(option => option.label === dados.ParoquiaMaisFrequentada)}
              onChange={(selectedOption) => {
                setDados({ ...dados, ParoquiaMaisFrequentada: selectedOption ? selectedOption.label : '' });
              }}
              isSearchable
              placeholder="Digite o nome da paróquia"
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

            <label htmlFor="ServicosComunitario">Serviços Comunitários:</label>
            <Select
            className='select-input'
              options={servicosComunitariosOptions}
              value={selectedServicosComunitarios}
              onChange={(newValue: MultiValue<any>, actionMeta: ActionMeta<any>) => {
                if (actionMeta.action === 'select-option') {
                  setSelectedServicosComunitarios(newValue);
                } else if (actionMeta.action === 'remove-value') {
                  setSelectedServicosComunitarios(newValue);
                }
              }}
              isMulti
              placeholder="Selecione ou digite para buscar serviços comunitários"
            />

            <label htmlFor="DataNascimento">Data de Nascimento:</label>
            <input
              type="date"
              id="DataNascimento"
              name="DataNascimento"
              value={dados.DataNascimento}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]}
            />

            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={dados.senha}
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
