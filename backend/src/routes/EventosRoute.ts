import express, { Router, Request, Response } from 'express';
import { getEventosDestacados, getEventos } from '../controllers/EventosController';

const router: Router = express.Router();

router.get('/destaque', getEventosDestacados);
router.get('/eventos', getEventos);


export default router;