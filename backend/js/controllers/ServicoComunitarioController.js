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
exports.getallNivelAcessoUsuario = exports.NivelAcessoUsuarioAbaixode5 = void 0;
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
const NivelAcessoUsuarioAbaixode5 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const db = pool;
        const user = yield db.query('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
        if (!user.rows.length) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const servicosComunitarios = yield db.query('SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = $1 AND NivelAcessoNoServico < 5', [user.rows[0].ID]);
        res.json(servicosComunitarios.rows);
        console.log(servicosComunitarios.rows);
    }
    catch (error) {
        console.error('Erro ao obter nível de acesso do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.NivelAcessoUsuarioAbaixode5 = NivelAcessoUsuarioAbaixode5;
const getallNivelAcessoUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const db = pool;
        const user = yield db.query('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
        if (!user.rows.length) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const servicosComunitarios = yield db.query('SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = $1', [user.rows[0].ID]);
        res.json(servicosComunitarios.rows);
        console.log(servicosComunitarios.rows);
    }
    catch (error) {
        console.error('Erro ao obter nível de acesso do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getallNivelAcessoUsuario = getallNivelAcessoUsuario;
