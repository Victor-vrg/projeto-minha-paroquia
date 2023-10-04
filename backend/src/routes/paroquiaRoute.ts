import { Router, Request, Response } from 'express';
import { getDatabaseInstance } from '../database/db'; // Importe a instância do banco de dados

const router = Router();

router.get('/paroquias', async (req: Request, res: Response): Promise<void> => {
  try {
    const searchText = req.query.s as string;

    if (!searchText.trim()) {
      res.status(400).json({ error: 'Texto de busca inválido' });
      return;
    }

    const query = `
      SELECT NomeParoquia
      FROM Paroquias
      WHERE NomeParoquia LIKE ?;
    `;

    const searchValue = `%${searchText}%`;

    const db = getDatabaseInstance();
    const sugestoes = await db.all(query, [searchValue]);

    res.json(sugestoes);
  } catch (error) {
    console.error('Erro ao buscar sugestões de paróquias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
