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
exports.checkUserAccess = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASS,
    port: 5432,
});
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    console.log('Received token:', token);
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const client = yield pool.connect();
        const result = yield client.query('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
        client.release();
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        req.user = {
            UserId: decodedToken.UserId,
            nomeCompleto: user.NomeCompleto,
            email: user.Email,
            Telefone: user.Telefone,
            Bairro: user.Bairro,
            DataNascimento: user.DataNascimento,
            paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
            idServicoComunitario: user.IDServicoComunitario,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});
exports.verifyToken = verifyToken;
const checkUserAccess = (IDServicoComunitario) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        try {
            const secretKey = process.env.secretKey;
            const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
            const client = yield pool.connect();
            const result = yield client.query('SELECT * FROM Usuarios WHERE ID = $1', [decodedToken.UserId]);
            client.release();
            const user = result.rows[0];
            if (!user) {
                return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
            }
            const userAccess = yield client.query('SELECT NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = $1 AND ServicoComunitarioID = $2', [user.ID, IDServicoComunitario]);
            console.log("acesso do usuario", userAccess.rows[0]);
            if (userAccess.rows[0] && userAccess.rows[0].NivelAcessoNoServico < 5) {
                // O nível de acesso é menor que 5, continue.
                next();
            }
            else {
                return res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
            }
        }
        catch (error) {
            return res.status(401).json({ error: 'Token inválido' });
        }
    });
};
exports.checkUserAccess = checkUserAccess;
