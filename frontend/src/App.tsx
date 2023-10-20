import React, { useState} from "react";
import "./styles/minha-paroquia.css";
import Login from "./components/login";
import EscolhaParoquia from "./components/EscolhaParoquia";
import PaginaPrincipalParoquia from "./components/PaginaPrincipalParoquia";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ParoquiaModel from "../../backend/src/models/paroquiaModel";


function App() {
  const [paroquiaSelecionada, setParoquiaSelecionada] =
    useState<ParoquiaModel | null>(null);

    return (
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/escolha-paroquia"
              element={<EscolhaParoquia setParoquiaSelecionada={setParoquiaSelecionada} />}
            />
            <Route
              path="/pagina-principal-paroquia"
              element={<PaginaPrincipalParoquia paroquiaSelecionada={paroquiaSelecionada} />}
            />
              <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
          
        </div>
      </BrowserRouter>
    );
  }

export default App;


