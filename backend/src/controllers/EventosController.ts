import { NextFunction, Request, Response } from 'express';
import EventosModel from '../models/eventosModel';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import { secretKey } from '../config';
import UsuarioModel from '../models/usuarioModel';
import { getDatabaseInstance } from '../database/db'; 


export const getEventosDestacados = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const eventosDestacados = await db.all<EventosModel[]>(
      'SELECT * FROM Eventos WHERE Destaque > 0'
    );
   
     console.log('Eventos Destacados:', eventosDestacados);
    res.json(eventosDestacados);

  } catch (error) {
    console.error('Erro ao buscar eventos destacados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getEventos = async (req: Request, res: Response) => {
  try {
    const db = getDatabaseInstance();
    const eventos = await db.all<EventosModel[]>(
      'SELECT * FROM Eventos ORDER BY DataInicio, HoraInicio'
    );
    res.json(eventos);
    console.log('Eventos :', eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


export const createEvento = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  try {
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const db = getDatabaseInstance();
    const user = await db.get<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = ?', [decodedToken.UserId]);
    if (!user) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }
  const {
    NomeEvento,
    DataInicio,
    DataFim,
    HoraInicio,
    HoraFim,
    LocalizacaoEvento,
    DescricaoEvento,
    CaminhoImagem,
    TipoEvento,
    Participacao,
    Destaque,
    Ocultar,
    IDServicoComunitario,
  } = req.body;

   
    const newEvento = await db.run(
      'INSERT INTO Eventos (NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento,  Destaque, ParoquiaID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento,  Destaque, user?.ParoquiaMaisFrequentada]
    );

    // Associe o evento aos serviços comunitários selecionados na tabela Eventos_ServicosComunitarios.
    for (const serviceId of IDServicoComunitario) {
      await db.run('INSERT INTO Eventos_ServicosComunitarios (EventoID, ServicoComunitarioID) VALUES (?, ?)', [newEvento.lastID, serviceId]);
    }

    res.status(201).json({ message: 'Evento criado com sucesso' });
    console.log(newEvento)
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
