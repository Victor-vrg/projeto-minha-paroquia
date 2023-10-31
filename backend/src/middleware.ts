import jwt, { JwtPayload } from 'jsonwebtoken'; 
import { secretKey } from './config';
import { NextFunction, Request, Response } from 'express';
import { getDatabaseInstance } from './database/db';
import UsuarioModel from './models/usuarioModel';

export const verifyToken = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  console.log('Received token:', token);
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload; 
    const db = getDatabaseInstance();
    const user = await db.get<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = ?', [decodedToken.UserId]);

    if (!user) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }

    req.user = {
      UserId: decodedToken.UserId,
      nomeCompleto: user.NomeCompleto,
      email: user.Email,
      Telefone: user.Telefone,
      Bairro: user.Bairro,
      DataNascimento: user.DataNascimento,
      paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
      idServicoComunitario: user.IDServicoComunitario,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const checkUserRole = (role: string, serviceId: number) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
      const decodedToken = jwt.verify(token, secretKey);
      const user = decodedToken as { id: number };
      // Consulte o banco de dados para verificar o nível de acesso do usuário no serviço comunitário especificado
      const db = getDatabaseInstance();
      const userAccess = await db.get('SELECT NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = ? AND ServicoComunitarioID = ?', [user.id, serviceId]);

      if (userAccess && userAccess.NivelAcessoNoServico === role) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};