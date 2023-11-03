import { Request, Response } from 'express';
import { getDatabaseInstance } from '../database/db';


export const obterSugestoesParoquias = async (req: Request, res: Response): Promise<void> => {
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
};

export const obterParoquiaPorNome = async (req: Request, res: Response): Promise<void> => {
  try {
    const nomeParoquia = req.params.nomeParoquia as string;

    const query = `
      SELECT *
      FROM Paroquias
      WHERE NomeParoquia = ?;
    `;

    const db = getDatabaseInstance();
    const paroquia = await db.get(query, [nomeParoquia]);

    if (paroquia) {
      res.json(paroquia);
    } else {
      res.status(404).json({ error: 'Paróquia não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar informações da paróquia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};