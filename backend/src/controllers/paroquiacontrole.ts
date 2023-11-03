import { Request, Response } from 'express';
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
      WHERE NomeParoquia LIKE $1;
    `;

    const searchValue = `%${searchText}%`;

    const client = await pool.connect();
    const { rows: sugestoes } = await client.query(query, [searchValue]);
    client.release();

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
      WHERE NomeParoquia = $1;
    `;

    const client = await pool.connect();
    const { rows: paroquias } = await client.query(query, [nomeParoquia]);
    client.release();

    if (paroquias.length > 0) {
      res.json(paroquias[0]);
    } else {
      res.status(404).json({ error: 'Paróquia não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar informações da paróquia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
