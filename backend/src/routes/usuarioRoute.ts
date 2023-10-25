import express from 'express';
import { verifyToken } from '../verificadorToken';
import {login , getUsers, cadastrarUsuario, getServicosComunitarios} from '../controllers/userController';

const router = express.Router();

router.post('/login',  login);
router.get('/getUsers' , verifyToken, getUsers)
router.post('/cadastrar', cadastrarUsuario);
router.get('/servicos-comunitarios', getServicosComunitarios);

export default router;
