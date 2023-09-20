import React from 'react';
import '../styles/minha-paroquia.css';

function EscolhaParoquia() {
  return (
    <div className="page-wrapper">
      <div className="content-wrapper">
        <div className="container">
          <h1>Escolha sua Paróquia</h1>
          <p>Digite o nome da sua paróquia:</p>
          <input type="text" placeholder="Nome da Paróquia" />
          <button>Buscar</button>
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
