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
exports.getExcursoes = exports.getExcursoesDestacadas = void 0;
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
const getExcursoesDestacadas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        const result = yield client.query('SELECT * FROM Excursoes WHERE Destaque > 0');
        client.release();
        const excursoesDestacadas = result.rows;
        res.json(excursoesDestacadas);
    }
    catch (error) {
        console.error('Erro ao buscar excursões destacadas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getExcursoesDestacadas = getExcursoesDestacadas;
const getExcursoes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        const result = yield client.query('SELECT * FROM Excursoes ORDER BY DataInicioExcursao, HoraInicioExcursao');
        client.release();
        const excursao = result.rows;
        res.json(excursao);
    }
    catch (error) {
        console.error('Erro ao buscar excursões:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getExcursoes = getExcursoes;
