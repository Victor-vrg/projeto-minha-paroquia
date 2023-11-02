import jwt, { JwtPayload } from 'jsonwebtoken'; 
import { secretKey } from './config';
import { NextFunction, Request, Response } from 'express';
import { getDatabaseInstance } from './database/db';
import UsuarioModel from './models/usuarioModel';
import { ServicoComunitario } from './models/ServicoComunitarioModels';

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

export const checkUserAccess = (IDServicoComunitario: number) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

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
      const userAccess = await db.get('SELECT NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = ? AND ServicoComunitarioID = ?', [user.ID, IDServicoComunitario]);
      console.log("acesso do usuario", userAccess)
      if (userAccess && userAccess.NivelAcessoNoServico < 5) {
        // O nível de acesso é menor que 5, continue.
        next();
      } else {
        return res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};

