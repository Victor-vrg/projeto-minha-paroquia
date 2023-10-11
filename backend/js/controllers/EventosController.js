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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventos = exports.getEventosDestacados = void 0;
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
