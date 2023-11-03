import { Request, Response } from 'express';
import ExcursaoModel from '../models/ExcursaoModel';
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

export const getExcursoesDestacadas = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query<ExcursaoModel>('SELECT * FROM Excursoes WHERE Destaque > 0');
    client.release();
    const excursoesDestacadas = result.rows;
    res.json(excursoesDestacadas);
  } catch (error) {
    console.error('Erro ao buscar excursões destacadas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getExcursoes = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query<ExcursaoModel>('SELECT * FROM Excursoes ORDER BY DataInicioExcursao, HoraInicioExcursao');
    client.release();
    const excursao = result.rows;
    res.json(excursao);
  } catch (error) {
    console.error('Erro ao buscar excursões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
