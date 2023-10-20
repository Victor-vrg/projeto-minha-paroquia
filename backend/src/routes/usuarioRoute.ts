import express from 'express';
import {login , getUsers} from '../controllers/userController';

const router = express.Router();

router.post('/login', login);
router.get('/getUsers', getUsers)

export default router;
