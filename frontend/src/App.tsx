import React, { useState} from "react";
import "./styles/minha-paroquia.css";
import Login from "./components/login";
import EscolhaParoquia from "./components/EscolhaParoquia";
import PaginaPrincipalParoquia from "./components/PaginaPrincipalParoquia";
import { BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ParoquiaModel from "../../backend/src/models/paroquiaModel";
import CadastroUsuario from './components/CadastroUsuario';
import RecuperacaoSenha from "./components/RecuperacaoSenha";
import PainelAdm from "./components/PainelADM";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  const [paroquiaSelecionada, setParoquiaSelecionada] =
    useState<ParoquiaModel | null>(null);

  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route
          path="/escolha-paroquia"
          element={<EscolhaParoquia setParoquiaSelecionada={setParoquiaSelecionada} />}
        />
        <Route
          path="/pagina-principal-paroquia"
          element={<PaginaPrincipalParoquia paroquiaSelecionada={paroquiaSelecionada} isFielDesconhecido  />}
        />
        <Route path="/continuar-sem-login"  element={<Navigate  to="/pagina-principal-paroquia"  />} />
        <Route path="/recuperar-senha" element={<RecuperacaoSenha />} />
        <Route path="/" element={<Navigate to="/escolha-paroquia" />} />
        <Route path="/Painel-adm" element={
            <PrivateRoute>
              {(userAccess) => <PainelAdm userAccess={userAccess} />}
            </PrivateRoute>
          } />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
