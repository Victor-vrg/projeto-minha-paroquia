
import { Router, Request, Response } from 'express';
import { Database } from 'sqlite';
import initDatabase from '../database/db';

const router = Router();

const dbPromise = initDatabase();

router.get('/paroquias', async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const searchText = req.query.s as string; 

    if (!searchText.trim()) {
      res.status(400).json({ error: 'Texto de busca inválido' });
      return;
    }
    // Consulta SQL para buscar sugestões de paróquias
    const query = `
      SELECT NomeParoquia
      FROM Paroquias
      WHERE NomeParoquia LIKE ?;
    `;

    const searchValue = `%${searchText}%`;

    const sugestoes = await db.all(query, [searchValue]);

    res.json(sugestoes);
  } catch (error) {
    console.error('Erro ao buscar sugestões de paróquias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
