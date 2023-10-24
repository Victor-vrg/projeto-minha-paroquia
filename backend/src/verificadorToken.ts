import { NextFunction,Request, Response } from 'express';
import { getDatabaseInstance } from './database/db'; 

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
  
    const db = getDatabaseInstance();
    const row = await db.get('SELECT Token FROM Tokens WHERE Token = ? AND Expiracao > ?', [token, new Date()]);
  
    if (!row) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  
    next(); 
  };

