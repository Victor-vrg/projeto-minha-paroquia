import React, { useState} from "react";
import "./styles/minha-paroquia.css";
import EscolhaParoquia from "./components/EscolhaParoquia";
import PaginaPrincipalParoquia from "./components/PaginaPrincipalParoquia";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ParoquiaModel from "../../backend/src/models/paroquiaModel";


function App() {
  const [paroquiaSelecionada, setParoquiaSelecionada] =
    useState<ParoquiaModel | null>(null);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <EscolhaParoquia
                setParoquiaSelecionada={setParoquiaSelecionada}
              />
            }
          />
          <Route
            path="/pagina-principal-paroquia"
            element={
              <PaginaPrincipalParoquia
                paroquiaSelecionada={paroquiaSelecionada}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


