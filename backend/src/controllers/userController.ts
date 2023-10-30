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
  const { NomeCompleto, Email, senha } = req.body; 
  try {
    
    // Verifique se NomeCompleto ou Email foram fornecidos
    if (!NomeCompleto && !Email) {
      throw new Error('Nome Completo ou Email são necessários.');
    }
    const db = getDatabaseInstance();
    const User = await db.get<UsuarioModel>(
      'SELECT * FROM Usuarios WHERE NomeCompleto = ? OR Email = ?',
      [NomeCompleto, Email]
    );
    if (!User) {
      throw new Error('Usuário não encontrado.');
    }

    // Verifique a senha
    const passwordMatch = await bcrypt.compare(senha, User.SenhaHash);

    if (!passwordMatch) {
      throw new Error('Senha incorreta.');
    }

    // Gere um token JWT para autenticar o usuário
    const token = jwt.sign(
      {
        UserId: User.ID,
        nomeCompleto: User.NomeCompleto,
        email: User.Email,
        paroquiaMaisFrequentada: User.ParoquiaMaisFrequentada,
        idServicoComunitario: User.IDServicoComunitario,
      },
      secretKey,
      { expiresIn: '3h' }
    );
    await db.run(
      'INSERT INTO Tokens (UserID, Token, Expiracao) VALUES (?, ?, ?)',
      [User.ID, token, new Date(new Date().getTime() + 10800000)] 
    );
    
    // Envie o token como resposta
    res.json({ token });
  } catch (error: any) { 
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario } = req.body;

  try {
   
    const senhaHash = await bcrypt.hash(req.body.senha, 10);

    const db = getDatabaseInstance();
    await db.run(
      'INSERT INTO Usuarios (NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, SenhaHash, IDServicoComunitario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, senhaHash, IDServicoComunitario]
    );

    res.json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getServicosComunitarios = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const servicosComunitarios = await db.all('SELECT * FROM ServicosComunitarios');
    res.json(servicosComunitarios);
  } catch (error) {
    console.error('Erro ao buscar serviços comunitários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const editarPerfil = async (req: Request, res: Response) => {
  const { UserId } = (req as Request & { user: { UserId: number } }).user; 
  // Você deve extrair o ID do usuário do token

  const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario } = req.body;

  try {
    const db = getDatabaseInstance();
    const existingUser = await db.get<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = ?', [UserId]);
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    // Implemente a lógica para atualizar o perfil do usuário no banco de dados
    await db.run(
      'UPDATE Usuarios SET NomeCompleto = ?, Email = ?, Telefone = ?, Bairro = ?, ParoquiaMaisFrequentada = ?, DataNascimento = ?, IDServicoComunitario = ? WHERE ID = ?',
      [NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, UserId]
    );

    res.json({ message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao editar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};