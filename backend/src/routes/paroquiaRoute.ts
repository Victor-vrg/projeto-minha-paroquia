import { Router } from 'express';
import { obterSugestoesParoquias,obterParoquiaPorNome} from '../controllers/paroquiacontrole'; 

const router = Router();

router.get('/paroquias', obterSugestoesParoquias); 
router.get('/paroquias-nome/:nomeParoquia', obterParoquiaPorNome);


export default router;
