"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarEventos = exports.createEvento = exports.getEventos = exports.getEventosDestacados = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const DB_PASS = process.env.DB_PASS;
const pool = new pg_1.Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DATABASE,
    password: DB_PASS,
    port: 5432,
});
const getEventosDestacados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventosDestacados = yield pool.query('SELECT * FROM Eventos WHERE Destaque > 0');
        console.log('Eventos Destacados:', eventosDestacados.rows);
        res.json(eventosDestacados.rows);
    }
    catch (error) {
        console.error('Erro ao buscar eventos destacados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getEventosDestacados = getEventosDestacados;
const getEventos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventos = yield pool.query('SELECT * FROM Eventos ORDER BY DataInicio, HoraInicio');
        console.log('Eventos :', eventos.rows);
        res.json(eventos.rows);
    }
    catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getEventos = getEventos;
const createEvento = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const user = yield pool.query('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const { NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque, Ocultar, IDServicoComunitario, } = req.body;
        const newEvento = yield pool.query('INSERT INTO Eventos (NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, ParoquiaID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING ID', [NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, user.rows[0].ParoquiaMaisFrequentada]);
        // Associe o evento aos serviços comunitários selecionados na tabela Eventos_ServicosComunitarios.
        for (const serviceId of IDServicoComunitario) {
            yield pool.query('INSERT INTO Eventos_ServicosComunitarios (EventoID, ServicoComunitarioID) VALUES ($1, $2)', [newEvento.rows[0].ID, serviceId]);
        }
        res.status(201).json({ message: 'Evento criado com sucesso' });
        console.log(newEvento.rows[0]);
    }
    catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createEvento = createEvento;
const editarEventos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const user = yield pool.query('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        // Obtenha os dados do evento a ser editado
        const eventId = req.params.id;
        const { NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, IDServicoComunitario, } = req.body;
        // Atualize os dados do evento no banco de dados
        yield pool.query('UPDATE Eventos SET NomeEvento = $1, DataInicio = $2, DataFim = $3, HoraInicio = $4, HoraFim = $5, LocalizacaoEvento = $6, DescricaoEvento = $7, CaminhoImagem = $8, TipoEvento = $9, Destaque = $10 WHERE ID = $11', [NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, eventId]);
        // Atualize a associação do evento aos serviços comunitários
        // Primeiro, exclua todas as associações antigas
        yield pool.query('DELETE FROM Eventos_ServicosComunitarios WHERE EventoID = $1', [eventId]);
        // Em seguida, insira as novas associações
        for (const serviceId of IDServicoComunitario) {
            yield pool.query('INSERT INTO Eventos_ServicosComunitarios (EventoID, ServicoComunitarioID) VALUES ($1, $2)', [eventId, serviceId]);
        }
        res.json({ message: 'Evento atualizado com sucesso' });
        console.log("atualizado evento");
    }
    catch (error) {
        console.error('Erro ao atualizar evento:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.editarEventos = editarEventos;
