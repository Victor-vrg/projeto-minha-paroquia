import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'; 
import UsuarioModel from '../models/usuarioModel';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  port: 5432,
});

export const getUsers = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM Usuarios';
    const { rows } = await pool.query<UsuarioModel>(query);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { NomeCompleto, Email, senha } = req.body; 
  try {
    if (!NomeCompleto && !Email) {
      throw new Error('Nome Completo ou Email são necessários.');
    }

    const query = 'SELECT * FROM Usuarios WHERE NomeCompleto = $1 OR Email = $2';
    const { rows } = await pool.query<UsuarioModel>(query, [NomeCompleto, Email]);

    if (rows.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(senha, user.SenhaHash);

    if (!passwordMatch) {
      throw new Error('Senha incorreta.');
    }

    const secretKey = process.env.secretKey as Secret;
    const token = jwt.sign(
      {
        UserId: user.ID,
        nomeCompleto: user.NomeCompleto,
        email: user.Email,
        Telefone: user.Telefone,
        Bairro: user.Bairro,
        DataNascimento: user.DataNascimento,
        paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
        idServicoComunitario: user.IDServicoComunitario,
      },
      secretKey,
      { expiresIn: '3h' }
    );

    const expiration = new Date(new Date().getTime() + 10800000);

    const tokenQuery = 'INSERT INTO Tokens (UserID, Token, Expiracao) VALUES ($1, $2, $3)';
    await pool.query(tokenQuery, [user.ID, token, expiration]);

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
    const query = 'INSERT INTO Usuarios (NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, SenhaHash, IDServicoComunitario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    await pool.query(query, [NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, senhaHash, IDServicoComunitario]);
    res.json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getServicosComunitarios = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM ServicosComunitarios';
    const { rows } = await pool.query(query);
    res.json(rows);
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
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const query = 'SELECT * FROM Usuarios WHERE ID = $1';
    const userResult = await pool.query<UsuarioModel>(query, [decodedToken.UserId]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }

    const user = userResult.rows[0];

    const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, NovaSenha } = req.body;

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

    const updateQuery = 'UPDATE Usuarios SET NomeCompleto = $1, Email = $2, Telefone = $3, Bairro = $4, ParoquiaMaisFrequentada = $5, DataNascimento = $6, IDServicoComunitario = $7, SenhaHash = $8 WHERE ID = $9';
    await pool.query(updateQuery, [user.NomeCompleto, user.Email, user.Telefone, user.Bairro, user.ParoquiaMaisFrequentada, user.DataNascimento, user.IDServicoComunitario, user.SenhaHash, user.ID]);

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
    const secretKey = process.env.secretKey as Secret;
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const query = 'SELECT * FROM Usuarios WHERE ID = $1';
    const userResult = await pool.query<UsuarioModel>(query, [decodedToken.UserId]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }

    const user = userResult.rows[0];

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
    console.log(userData);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
