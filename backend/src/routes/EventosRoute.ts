import express, { Router, Request, Response } from 'express';
import EventosModel from '../models/eventosModel';
import { getDatabaseInstance } from '../database/db'; 
import { getEventosDestacados, getEventos, getEventosrecentes } from '../controllers/EventosController';

const router: Router = express.Router();


router.get('/destaque', getEventosDestacados);
router.get('/eventos', getEventos);
router.get('/eventos-recentes', getEventosrecentes);


export default router;