import React from 'react';
import EditarPerfilUsuario from './EdicaoPerfilUsuario';
import PrivateRoute from './PrivateRoute';

function PainelAdm() {
  return (
    <PrivateRoute>
    <div>
      <EditarPerfilUsuario />
    </div>
    </PrivateRoute>
  );
}


export default PainelAdm;
