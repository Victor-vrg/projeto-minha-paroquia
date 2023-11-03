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
exports.obterParoquiaPorNome = exports.obterSugestoesParoquias = void 0;
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
const obterSugestoesParoquias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchText = req.query.s;
        if (!searchText.trim()) {
            res.status(400).json({ error: 'Texto de busca inválido' });
            return;
        }
        const query = `
      SELECT NomeParoquia
      FROM Paroquias
      WHERE NomeParoquia LIKE $1;
    `;
        const searchValue = `%${searchText}%`;
        const client = yield pool.connect();
        const { rows: sugestoes } = yield client.query(query, [searchValue]);
        client.release();
        res.json(sugestoes);
    }
    catch (error) {
        console.error('Erro ao buscar sugestões de paróquias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.obterSugestoesParoquias = obterSugestoesParoquias;
const obterParoquiaPorNome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nomeParoquia = req.params.nomeParoquia;
        const query = `
      SELECT *
      FROM Paroquias
      WHERE NomeParoquia = $1;
    `;
        const client = yield pool.connect();
        const { rows: paroquias } = yield client.query(query, [nomeParoquia]);
        client.release();
        if (paroquias.length > 0) {
            res.json(paroquias[0]);
        }
        else {
            res.status(404).json({ error: 'Paróquia não encontrada' });
        }
    }
    catch (error) {
        console.error('Erro ao buscar informações da paróquia:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.obterParoquiaPorNome = obterParoquiaPorNome;
