import jwt from 'jsonwebtoken';
import { secretKey } from './config';
import { NextFunction, Request, Response } from 'express';
import { getDatabaseInstance } from './database/db';


export const verifyToken = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const db = getDatabaseInstance();
  const row = await db.get('SELECT Token FROM Tokens WHERE Token = ? AND Expiracao > ?', [token, new Date()]);

  if (!row) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
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