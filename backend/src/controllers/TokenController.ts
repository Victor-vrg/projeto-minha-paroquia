import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { Pool } from 'pg';

const emailService = process.env.EMAIL_SERVICE;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  port: 5432,
});

export const enviarEmailRecuperacao = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const client = await pool.connect();
    const user = await client.query('SELECT * FROM Usuarios WHERE Email = $1', [email]);
    client.release();

    if (user.rowCount === 0) {
      throw new Error('Usuário não encontrado.');
    }

    // Gere um token de recuperação
    const token = generateRandomToken();
    const expiracao = new Date(new Date().getTime() + 3600000);
    
    const client2 = await pool.connect();
    await client2.query(
      'INSERT INTO Tokens (UserID, Token, Expiracao) VALUES ($1, $2, $3)',
      [user.rows[0].id, token, expiracao]
    );
    client2.release();

    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: 'Recuperação de Senha',
      text: `Use o código a seguir para recuperar sua senha: ${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar o email:', error);
        res.status(500).json({ error: 'Erro ao enviar o email de recuperação.' });
      } else {
        res.json({ message: 'Email de recuperação enviado com sucesso.' });
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export const verificarTokenRecuperacao = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    const client = await pool.connect();
    const tokenInfo = await client.query(
      'SELECT * FROM Tokens WHERE Token = $1 AND Expiracao >= $2',
      [token, new Date()]
    );

    if (tokenInfo.rowCount === 0) {
      throw new Error('Token inválido ou expirado.');
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await client.query('UPDATE Usuarios SET SenhaHash = $1 WHERE ID = $2', [senhaHash, tokenInfo.rows[0].userid]);

    await client.query('DELETE FROM Tokens WHERE Token = $1', [token]);

    client.release();

    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

function generateRandomToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const tokenLength = 8;

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}
