import { Request, Response } from 'express';
import FeedbackModel from '../models/feedbackModel';
import { getDatabaseInstance } from '../database/db';



export const addFeedback = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const { NomeUsuario, email, mensagem } = req.body; 
    const statement = await db.prepare(
      'INSERT INTO Feedback (NomeUsuario, email, mensagem) VALUES (?, ?, ?)'
    );
    await statement.run(NomeUsuario, email, mensagem);
    await statement.finalize();
    res.status(201).json({ message: 'Feedback adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar feedback:', error);
    res.status(500).json({ error: 'Erro ao adicionar feedback' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const feedbacks = await db.all('SELECT * FROM Feedback ORDER BY ID DESC');
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    res.status(500).json({ error: 'Erro ao buscar feedbacks' });
  }
};
