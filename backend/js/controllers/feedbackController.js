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
exports.getFeedbacks = exports.addFeedback = void 0;
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
const addFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { NomeUsuario, Email, Mensagem } = req.body;
        const query = 'INSERT INTO Feedback (NomeUsuario, Email, Mensagem) VALUES ($1, $2, $3)';
        const values = [NomeUsuario, Email, Mensagem];
        yield pool.query(query, values);
        res.status(201).json({ message: 'Feedback adicionado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao adicionar feedback:', error);
        res.status(500).json({ error: 'Erro ao adicionar feedback' });
    }
});
exports.addFeedback = addFeedback;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM Feedback ORDER BY ID DESC';
        const { rows } = yield pool.query(query);
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        res.status(500).json({ error: 'Erro ao buscar feedbacks' });
    }
});
exports.getFeedbacks = getFeedbacks;
