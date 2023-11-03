import React from 'react';
import EditarPerfilUsuario from './EdicaoPerfilUsuario';
import CriarEventos from './CriarEventos';
import EditarEvento from './EditarEventos';


interface PainelAdmProps {
  userAccess: { NivelAcessoNoServico: number }[]; 
}

function PainelAdm({ userAccess }: PainelAdmProps) {
  const hasPermission = userAccess.some((servico) => servico.NivelAcessoNoServico < 5);
  
  if (hasPermission) {
    return (
      <div>
        <EditarPerfilUsuario />
        <CriarEventos />
        <EditarEvento />
      </div>
    );
  } else {
    console.log('Usuário não tem permissão para exibir o Gerenciador de Eventos.');
    return (
      <div>
        <EditarPerfilUsuario />
      </div>
    );
  }
}

export default PainelAdm;
