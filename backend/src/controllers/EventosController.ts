import { NextFunction, Request, Response } from 'express';
import EventosModel from '../models/eventosModel';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'; 
import UsuarioModel from '../models/usuarioModel';
import { Pool } from 'pg';

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const DB_PASS = process.env.DB_PASS;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DATABASE,
  password: DB_PASS,
  port: 5432,
});

export const getEventosDestacados = async (req: Request, res: Response) => {
  try {
    const eventosDestacados = await pool.query<EventosModel[]>(
      'SELECT * FROM Eventos WHERE Destaque > 0'
    );

    console.log('Eventos Destacados:', eventosDestacados.rows);
    res.json(eventosDestacados.rows);
  } catch (error) {
    console.error('Erro ao buscar eventos destacados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await pool.query<EventosModel[]>(
      'SELECT * FROM Eventos ORDER BY DataInicio, HoraInicio'
    );
    console.log('Eventos :', eventos.rows);
    res.json(eventos.rows);
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
    const secretKey = process.env.secretKey as Secret; 
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const user = await pool.query<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);

    if (user.rows.length === 0) {
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

    const newEvento = await pool.query(
      'INSERT INTO Eventos (NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, ParoquiaID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING ID',
      [NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, user.rows[0].ParoquiaMaisFrequentada]
    );

    // Associe o evento aos serviços comunitários selecionados na tabela Eventos_ServicosComunitarios.
    for (const serviceId of IDServicoComunitario) {
      await pool.query('INSERT INTO Eventos_ServicosComunitarios (EventoID, ServicoComunitarioID) VALUES ($1, $2)', [newEvento.rows[0].ID, serviceId]);
    }

    res.status(201).json({ message: 'Evento criado com sucesso' });
    console.log(newEvento.rows[0]);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export const editarEventos = async (req: Request, res: Response) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const secretKey = process.env.secretKey as Secret; 
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    const user = await pool.query<UsuarioModel>('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
    }

    // Obtenha os dados do evento a ser editado
    const eventId = req.params.id;
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
      Destaque,
      IDServicoComunitario,
    } = req.body;

    // Atualize os dados do evento no banco de dados
    await pool.query(
      'UPDATE Eventos SET NomeEvento = $1, DataInicio = $2, DataFim = $3, HoraInicio = $4, HoraFim = $5, LocalizacaoEvento = $6, DescricaoEvento = $7, CaminhoImagem = $8, TipoEvento = $9, Destaque = $10 WHERE ID = $11',
      [NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, eventId]
    );

    // Atualize a associação do evento aos serviços comunitários
    // Primeiro, exclua todas as associações antigas
    await pool.query('DELETE FROM Eventos_ServicosComunitarios WHERE EventoID = $1', [eventId]);

    // Em seguida, insira as novas associações
    for (const serviceId of IDServicoComunitario) {
      await pool.query('INSERT INTO Eventos_ServicosComunitarios (EventoID, ServicoComunitarioID) VALUES ($1, $2)', [eventId, serviceId]);
    }

    res.json({ message: 'Evento atualizado com sucesso' });
    console.log("atualizado evento");
    
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
