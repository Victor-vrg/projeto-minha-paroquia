import express, { Router, Request, Response } from 'express';
import { getEventosDestacados, getEventos, createEvento } from '../controllers/EventosController';
import { checkUserAccess, verifyToken } from '../middleware';

const router: Router = express.Router();

router.get('/destaque', getEventosDestacados);
router.get('/eventos', getEventos);

router.post('/criar', verifyToken, (req, res, next) => {
  const { IDServicoComunitario } = req.body;
  const permissionsPromises = IDServicoComunitario.map((IDServicoComunitario: number) => {
    return new Promise<void>((resolve, reject) => {
      checkUserAccess(IDServicoComunitario)(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });

  Promise.all(permissionsPromises)
    .then(() => {
      // Se todas as verificações de permissão passarem, crie o evento.
      createEvento(req, res, next);
    })
    .catch((error) => {
      // Se uma das verificações de permissão falhar, retorne um erro de acesso não autorizado.
      res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
    });
});


export default router;