"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventosrecentes = exports.getEventos = exports.getEventosDestacados = void 0;
const db_1 = require("../database/db");
const getEventosDestacados = async (req, res) => {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const eventosDestacados = await db.all('SELECT * FROM Eventos WHERE Destaque > 0');
        console.log('Eventos Destacados:', eventosDestacados);
        res.json(eventosDestacados);
    }
    catch (error) {
        console.error('Erro ao buscar eventos destacados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getEventosDestacados = getEventosDestacados;
const getEventos = async (req, res) => {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const eventos = await db.all('SELECT * FROM Eventos ORDER BY DataInicio, HoraInicio');
        res.json(eventos);
        console.log('Eventos :', eventos);
    }
    catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getEventos = getEventos;
const getEventosrecentes = async (req, res) => {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const eventos = await db.all('SELECT * FROM Eventos ORDER BY DataInicio, HoraInicio');
        res.json(eventos);
        console.log('Eventos recentes:', eventos);
    }
    catch (error) {
        console.error('Erro ao buscar eventos recentes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getEventosrecentes = getEventosrecentes;
