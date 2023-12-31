import React, { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface PrivateRouteProps {
  children: (userAccess: any[]) => ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const [userAccess, setUserAccess] = useState<any[]>([]);
  const api = axios.create({
    baseURL: 'https://backend-minha-paroquia.vercel.app/',
  });
  useEffect(() => {
    if (!authToken || authToken === 'fiel-desconhecido') {
      navigate('/pagina-principal-paroquia');
    } else {
      api
        .get('/role/niveis-de-acesso', {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          setUserAccess(response.data);
        })
        .catch((error) => {
          console.error('Erro ao obter nível de acesso do usuário:', error);
          navigate('/pagina-principal-paroquia');
        });
    }
  }, [authToken, navigate]);

  return <>{children(userAccess)}</>;
};

export default PrivateRoute;
