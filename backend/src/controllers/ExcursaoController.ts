import { Request, Response } from 'express';
import ExcursaoModel from '../models/ExcursaoModel';
import { getDatabaseInstance } from '../database/db'; 

export const getExcursoesDestacadas = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const excursoesDestacadas = await db.all<ExcursaoModel[]>(
      'SELECT * FROM Excursoes WHERE Destaque > 0'
    );
    res.json(excursoesDestacadas);
  } catch (error) {
    console.error('Erro ao buscar excursões destacadas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getExcursoes = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const excursao = await db.all<ExcursaoModel[]>(
      'SELECT * FROM Excursoes ORDER BY DataInicioExcursao, HoraInicioExcursao'
    );
    res.json(excursao);
  } catch (error) {
    console.error('Erro ao buscar excursões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
