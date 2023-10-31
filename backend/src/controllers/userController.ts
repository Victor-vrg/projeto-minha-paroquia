import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
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
    // Verifique NomeCompleto ou Email 
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
    const passwordMatch = await bcrypt.compare(senha, User.SenhaHash);
    if (!passwordMatch) {
      throw new Error('Senha incorreta.');
    }
   
    const token = jwt.sign(
      {
        UserId: User.ID,
        nomeCompleto: User.NomeCompleto,
        email: User.Email,
        Telefone: User.Telefone,
        Bairro: User.Bairro,
        DataNascimento: User.DataNascimento,
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
    console.log('Token gerado:', token);
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

    // Dados a serem atualizados
    const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, NovaSenha } = req.body;

    // Verifique se os campos a serem atualizados estão presentes no corpo da solicitação
    if (NomeCompleto) {
      user.NomeCompleto = NomeCompleto;
    }
    if (Email) {
      user.Email = Email;
    }
    if (Telefone) {
      user.Telefone = Telefone;
    }
    if (Bairro) {
      user.Bairro = Bairro;
    }
    if (ParoquiaMaisFrequentada) {
      user.ParoquiaMaisFrequentada = ParoquiaMaisFrequentada;
    }
    if (DataNascimento) {
      user.DataNascimento = DataNascimento;
    }
    if (IDServicoComunitario) {
      user.IDServicoComunitario = IDServicoComunitario;
    }
    if (NovaSenha) {
      const senhaHash = await bcrypt.hash(NovaSenha, 10);
      user.SenhaHash = senhaHash;
    }

    // Atualize o perfil do usuário no banco de dados
    await db.run(
      'UPDATE Usuarios SET NomeCompleto = ?, Email = ?, Telefone = ?, Bairro = ?, ParoquiaMaisFrequentada = ?, DataNascimento = ?, IDServicoComunitario = ?, SenhaHash = ? WHERE ID = ?',
      [user.NomeCompleto, user.Email, user.Telefone, user.Bairro, user.ParoquiaMaisFrequentada, user.DataNascimento, user.IDServicoComunitario, user.SenhaHash, user.ID]
    );


    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};


export const getUsuarioLogado = async (req: Request, res: Response, next: NextFunction) => {
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

    // Você pode ajustar os campos de resposta conforme necessário
    const userData = {
      UserId: decodedToken.UserId,
      nomeCompleto: user.NomeCompleto,
      email: user.Email,
      telefone: user.Telefone,
      bairro: user.Bairro,
      dataNascimento: user.DataNascimento,
      paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
      idServicoComunitario: user.IDServicoComunitario,
    };

    res.json(userData);
    console.log(userData)
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};