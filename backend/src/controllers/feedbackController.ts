import { Request, Response } from 'express';
import FeedbackModel from '../models/feedbackModel';
import { Pool } from 'pg';

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

export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { NomeUsuario, Email, Mensagem } = req.body;
    const query = 'INSERT INTO Feedback (NomeUsuario, Email, Mensagem) VALUES ($1, $2, $3)';
    const values = [NomeUsuario, Email, Mensagem];
    await pool.query(query, values);
    res.status(201).json({ message: 'Feedback adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar feedback:', error);
    res.status(500).json({ error: 'Erro ao adicionar feedback' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM Feedback ORDER BY ID DESC';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    res.status(500).json({ error: 'Erro ao buscar feedbacks' });
  }
};
