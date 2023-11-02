import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import { secretKey } from '../config';
import { ServicoComunitario } from '../models/ServicoComunitarioModels';

import { getDatabaseInstance } from '../database/db';
import UsuarioModel from '../models/usuarioModel';

export const NivelAcessoUsuarioAbaixode5 = async (req: Request & { user?: any }, res: Response) => {
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
    const servicosComunitarios = await db.all<ServicoComunitario>(
      'SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = ? AND NivelAcessoNoServico < 5',
      [user.ID]
    );

    res.json(servicosComunitarios);
    console.log (servicosComunitarios)
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
    
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const db = getDatabaseInstance();
    const user = await db.get<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = ?', [decodedToken.UserId]);

    if (!user) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }
    const servicosComunitarios = await db.all<ServicoComunitario>(
      'SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = ?',
      [user.ID]
    );

    res.json(servicosComunitarios);
    console.log (servicosComunitarios)
  } catch (error) {
    console.error('Erro ao obter nível de acesso do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
  };