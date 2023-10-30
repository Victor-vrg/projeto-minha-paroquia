import express from 'express';
import { verifyToken } from '../middleware';
import {login , getUsers, cadastrarUsuario, getServicosComunitarios, editarPerfil } from '../controllers/userController';

const router = express.Router();

router.post('/login',  login);
router.get('/getUsers' , verifyToken, getUsers) // somente admin-paroquia pode ver, e sem ver senha!
router.post('/cadastrar', cadastrarUsuario);
router.get('/servicos-comunitarios', getServicosComunitarios);
router.put('/editar-perfil', verifyToken, editarPerfil)

export default router;
