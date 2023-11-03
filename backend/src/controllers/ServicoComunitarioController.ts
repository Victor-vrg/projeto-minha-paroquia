import { Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { ServicoComunitario } from '../models/ServicoComunitarioModels';
import { Pool } from 'pg';
import UsuarioModel from '../models/usuarioModel';

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const DB_PASS = process.env.DB_PASS;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DATABASE,
  password: DB_PASS,
  port: 5432,
});

export const NivelAcessoUsuarioAbaixode5 = async (req: Request & { user?: any }, res: Response) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const db = pool;
    const user = await db.query<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);

    if (!user.rows.length) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }
    const servicosComunitarios = await db.query<ServicoComunitario>(
      'SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = $1 AND NivelAcessoNoServico < 5',
      [user.rows[0].ID]
    );

    res.json(servicosComunitarios.rows);
    console.log(servicosComunitarios.rows);
  } catch (error) {
    console.error('Erro ao obter nível de acesso do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getallNivelAcessoUsuario = async (req: Request & { user?: any }, res: Response) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const db = pool;
    const user = await db.query<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);

    if (!user.rows.length) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }
    const servicosComunitarios = await db.query<ServicoComunitario>(
      'SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = $1',
      [user.rows[0].ID]
    );

    res.json(servicosComunitarios.rows);
    console.log(servicosComunitarios.rows);
  } catch (error) {
    console.error('Erro ao obter nível de acesso do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
