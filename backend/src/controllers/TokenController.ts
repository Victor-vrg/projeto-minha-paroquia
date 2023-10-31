import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { EmailParoquia, Emailuser } from '../config';
import UsuarioModel from '../models/usuarioModel';
import TokenModel from '../models/TokenModel';
import { getDatabaseInstance } from '../database/db';

export const enviarEmailRecuperacao = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const db = getDatabaseInstance();
    const user = await db.get<UsuarioModel>('SELECT * FROM Usuarios WHERE Email = ?', [email]);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    // Gere um token de recuperação
    const token = generateRandomToken(); 
    await db.run(
      'INSERT INTO Tokens (UserID, Token, Expiracao) VALUES (?, ?, ?)',
      [user.ID, token, new Date(new Date().getTime() + 3600000)]
    );

    const transporter = EmailParoquia;

    const mailOptions = {
      from: Emailuser,
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
    const db = getDatabaseInstance();
    const tokenInfo = await db.get<TokenModel>(
      'SELECT * FROM Tokens WHERE Token = ? AND Expiracao >= ?',
      [token, new Date()]
    );

    if (!tokenInfo) {
      throw new Error('Token inválido ou expirado.');
    }

    // Atualize a senha do usuário
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await db.run('UPDATE Usuarios SET SenhaHash = ? WHERE ID = ?', [senhaHash, tokenInfo.UserID]);

    // Remova o token de recuperação após o uso
    await db.run('DELETE FROM Tokens WHERE Token = ?', [token]);

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
    const randomIndex = Math.floor(Math.random() * characters.length );
    token += characters.charAt(randomIndex);
  }

  return token;
}