"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExcursoes = exports.getExcursoesDestacadas = void 0;
const db_1 = require("../database/db");
const getExcursoesDestacadas = async (req, res) => {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const excursoesDestacadas = await db.all('SELECT * FROM Excursoes WHERE Destaque > 0');
        res.json(excursoesDestacadas);
    }
    catch (error) {
        console.error('Erro ao buscar excursões destacadas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getExcursoesDestacadas = getExcursoesDestacadas;
const getExcursoes = async (req, res) => {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const excursao = await db.all('SELECT * FROM Excursoes ORDER BY DataInicioExcursao, HoraInicioExcursao');
        res.json(excursao);
    }
    catch (error) {
        console.error('Erro ao buscar excursões:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
exports.getExcursoes = getExcursoes;
