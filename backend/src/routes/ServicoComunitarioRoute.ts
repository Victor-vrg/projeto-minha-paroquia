import express from 'express';
import { verifyToken, checkUserAccess } from '../middleware';
import { getallNivelAcessoUsuario, NivelAcessoUsuarioAbaixode5 } from '../controllers/ServicoComunitarioController';

const router = express.Router();

router.get('/niveis-de-acesso', verifyToken,  getallNivelAcessoUsuario);// pega todos niveis de acesso
router.get('/niveis-abaixode5', verifyToken,  NivelAcessoUsuarioAbaixode5); //abaixo de nivel 5 pode criar algo em algum serviço-comunitario


export default router;