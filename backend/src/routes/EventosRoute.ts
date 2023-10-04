import { getDatabaseInstance } from '../database/db'; 
import { getEventosDestacados, getEventos } from '../controllers/EventosController';
import express, { Router, Request, Response } from 'express';
import EventosModel from '../models/eventosModel';

const router: Router = express.Router();


router.get('/destaque', getEventosDestacados);
router.get('/eventos', getEventos);

router.get('/eventos-recentes', async (req: Request, res: Response) => {
    try {
      const db = getDatabaseInstance(); 
      console.log('Rota de eventos-recentes acessada');
      const eventosRecentes = await db.all<EventosModel[]>(
        'SELECT NomeEvento AS NomeEvento FROM Eventos'
      );
      console.log('Eventos recentes:', eventosRecentes);
      res.json(eventosRecentes);
    } catch (error) {
      console.error('Erro ao buscar eventos recentes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  

export default router;