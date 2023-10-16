import { Request, Response } from 'express';
import  paroquiaModel  from '../models/paroquiaModel';
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
// obter dado da paroquia escolhida pelo usuario para enviar informações sobre ela para componente entreemcontato
export const obterParoquiaPorNome = async (req: Request, res: Response): Promise<void> => {
  try {
    const paroquiaNome = req.params.nomeParoquia as string;
    const query = `
    SELECT *
    FROM Paroquias
    WHERE NomeParoquia = ?;;
    `;

    const db = getDatabaseInstance();
    const paroquia = await db.get(query, [paroquiaNome]);

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
  export const obterCEPParoquiaPorNome = async (req: Request, res: Response): Promise<void> => {
    try {
      const paroquiaID = req.params.id as string;
      const query = `
        SELECT CEP
        FROM Paroquias
        WHERE NomeParoquia = ?;
      `;
  
      const db = getDatabaseInstance();
      const resultado = await db.get(query, [paroquiaID]);
  
      if (resultado) {
        res.json({ CEP: resultado.CEP });
      } else {
        res.status(404).json({ error: 'Paróquia não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP da paróquia:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };