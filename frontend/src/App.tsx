import React from 'react';
import './styles/minha-paroquia.css';
import EscolhaParoquia from './components/EscolhaParoquia';
import Footer from './components/footer';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <EscolhaParoquia />
        <Footer />
      </div>
    </BrowserRouter>
  )
}
export default App;