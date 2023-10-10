import { Request, Response } from 'express';
import EventosModel from '../models/eventosModel';
import { getDatabaseInstance } from '../database/db'; 


export const getEventosDestacados = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const eventosDestacados = await db.all<EventosModel[]>(
      'SELECT * FROM Eventos WHERE Destaque > 0'
    );
   
     console.log('Eventos Destacados:', eventosDestacados);
    res.json(eventosDestacados);

  } catch (error) {
    console.error('Erro ao buscar eventos destacados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getEventos = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const eventos = await db.all<EventosModel[]>(
      'SELECT * FROM Eventos ORDER BY DataInicio, HoraInicio'
    );
    res.json(eventos);
    console.log('Eventos :', eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


