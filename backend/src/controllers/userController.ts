import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config';
import UsuarioModel from '../models/usuarioModel';
import { getDatabaseInstance } from '../database/db';

// Controlador para buscar todos os usuários
export const getUsers = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const users = await db.all<UsuarioModel[]>('SELECT * FROM Usuarios');
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { NomeCompleto, Email, senha } = req.body; // Obtenha os dados do corpo da solicitação

  try {
    // Verifique se NomeCompleto ou Email foram fornecidos
    if (!NomeCompleto && !Email) {
      throw new Error('Nome Completo ou Email são necessários.');
    }

    // Consulte o usuário com base no NomeCompleto ou Email
    const db = getDatabaseInstance();
    const user = await db.get<UsuarioModel>(
      'SELECT * FROM Usuarios WHERE NomeCompleto = ? OR Email = ?',
      [NomeCompleto, Email]
    );

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Verifique a senha
    const passwordMatch = await bcrypt.compare(senha, user.SenhaHash);

    if (!passwordMatch) {
      throw new Error('Senha incorreta.');
    }

    // Gere um token JWT para autenticar o usuário
    const token = jwt.sign({ userId: user.ID }, secretKey, { expiresIn: '1h' });

    // Envie o token como resposta
    res.json({ token });
  } catch (error: any) { // Adicione o tipo 'any' ou um tipo mais apropriado
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
