import { Router } from 'express';
import { obterSugestoesParoquias, obterCEPParoquiaPorNome, obterParoquiaPorNome} from '../controllers/paroquiacontrole'; 

const router = Router();

router.get('/paroquias', obterSugestoesParoquias); 
router.get('/paroquias-nome', obterParoquiaPorNome); 
router.get('/paroquias-cep-nome', obterCEPParoquiaPorNome); 

export default router;
