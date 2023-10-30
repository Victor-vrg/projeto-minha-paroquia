import React, { useEffect } from "react";
import { useNavigate  } from "react-router-dom";

// garantir que fiel-desconhecido não consiga usar a rota do painel-adm
const PrivateRoute = <Component extends React.ReactNode>({ children }: { children: Component }) => {
  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log(authToken);

    if (!authToken || authToken === 'fiel-desconhecido') {
      navigate('/pagina-principal-paroquia');
    }
  }, [authToken, navigate]);

  return <>{children}</>;
};


export default PrivateRoute;


