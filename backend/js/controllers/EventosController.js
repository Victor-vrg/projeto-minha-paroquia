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
exports.createEvento = exports.getEventos = exports.getEventosDestacados = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const db_1 = require("../database/db");
const getEventosDestacados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const eventosDestacados = yield db.all('SELECT * FROM Eventos WHERE Destaque > 0');
        console.log('Eventos Destacados:', eventosDestacados);
        res.json(eventosDestacados);
    }
    catch (error) {
        console.error('Erro ao buscar eventos destacados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getEventosDestacados = getEventosDestacados;
const getEventos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const eventos = yield db.all('SELECT * FROM Eventos ORDER BY DataInicio, HoraInicio');
        res.json(eventos);
        console.log('Eventos :', eventos);
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
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        const db = (0, db_1.getDatabaseInstance)();
        const user = yield db.get('SELECT * FROM Usuarios WHERE ID = ?', [decodedToken.UserId]);
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const { NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque, Ocultar, IDServicoComunitario, } = req.body;
        const newEvento = yield db.run('INSERT INTO Eventos (NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento,  Destaque, ParoquiaID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Destaque, user === null || user === void 0 ? void 0 : user.ParoquiaMaisFrequentada]);
        // Associe o evento aos serviços comunitários selecionados na tabela Eventos_ServicosComunitarios.
        for (const serviceId of IDServicoComunitario) {
            yield db.run('INSERT INTO Eventos_ServicosComunitarios (EventoID, ServicoComunitarioID) VALUES (?, ?)', [newEvento.lastID, serviceId]);
        }
        res.status(201).json({ message: 'Evento criado com sucesso' });
        console.log(newEvento);
    }
    catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.createEvento = createEvento;
