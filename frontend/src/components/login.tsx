import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

function Login() {
  const [NomeCompleto, setNomeCompleto] = useState('');
  const [senha, setsenha] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do botão de submit
  
    try {
      console.log('Tentativa de login:', NomeCompleto, senha);
  
      // Enviar os dados de autenticação (NomeCompleto, Email, senha) para o backend
      const response = await axios.post('http://localhost:3001/usuarios/login', {
        NomeCompleto,
        Email: NomeCompleto, // Você pode usar o mesmo valor para Email
        senha,
      });
  
      // Se a autenticação for bem-sucedida, o token será retornado
      const authToken = response.data.token;
  
      // Armazenar o token no estado (ou em localStorage, dependendo das necessidades)
      setToken(authToken);
  
      console.log('Login bem-sucedido:', NomeCompleto);
  
      // Redirecionar o usuário para a página apropriada após o login
      navigate('/pagina-principal-paroquia'); // Redireciona para a página de dashboard após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Lógica para lidar com erros, como exibir uma mensagem de erro para o usuário
    }
  };
  

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-central">
          <h2>Login</h2>
          <form className="login-form">
            <label htmlFor="NomeCompleto">Usuário</label>
            <input
              type="text"
              id="NomeCompleto"
              name="NomeCompleto"
              placeholder="Digite o seu nome de usuário ou seu email"
              value={NomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
            />
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setsenha(e.target.value)}
              required
            />
            <button className='.login-button' type="submit" onClick={handleLogin}>
              Entrar
            </button>
            <p className="signup-link">
              Não tem usuário? <a href="/cadastro">Cadastre-se</a>
            </p>
            <p className="signup-link">
              Esqueceu a senha? <a href="/recuperar-senha">Recuperar a senha</a>
            </p>
            <p className="continue-link">
              <a href="/pagina-principal-paroquia">Continuar sem login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
