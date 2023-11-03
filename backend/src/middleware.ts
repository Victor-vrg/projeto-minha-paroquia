import jwt, { JwtPayload, Secret } from 'jsonwebtoken'; 
import { NextFunction, Request, Response } from 'express';
import { Pool } from 'pg';
import UsuarioModel from './models/usuarioModel';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  port: 5432,
});

export const verifyToken = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  console.log('Received token:', token);
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret; 
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;

    const client = await pool.connect();
    const result = await client.query<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
    client.release();

    const user = result.rows[0];

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
      const secretKey = process.env.secretKey as Secret; 
      const decodedToken = jwt.verify(token, secretKey) as JwtPayload;

      const client = await pool.connect();
      const result = await client.query<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
      client.release();

      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
      }

      const userAccess = await client.query('SELECT NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = $1 AND ServicoComunitarioID = $2', [user.ID, IDServicoComunitario]);
      console.log("acesso do usuario", userAccess.rows[0])
      if (userAccess.rows[0] && userAccess.rows[0].NivelAcessoNoServico < 5) {
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
