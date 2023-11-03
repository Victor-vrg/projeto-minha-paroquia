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
exports.getUsuarioLogado = exports.editarPerfil = exports.getServicosComunitarios = exports.cadastrarUsuario = exports.login = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASS,
    port: 5432,
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM Usuarios';
        const { rows } = yield pool.query(query);
        res.json(rows);
    }
    catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getUsers = getUsers;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NomeCompleto, Email, senha } = req.body;
    try {
        if (!NomeCompleto && !Email) {
            throw new Error('Nome Completo ou Email são necessários.');
        }
        const query = 'SELECT * FROM Usuarios WHERE NomeCompleto = $1 OR Email = $2';
        const { rows } = yield pool.query(query, [NomeCompleto, Email]);
        if (rows.length === 0) {
            throw new Error('Usuário não encontrado.');
        }
        const user = rows[0];
        const passwordMatch = yield bcrypt_1.default.compare(senha, user.SenhaHash);
        if (!passwordMatch) {
            throw new Error('Senha incorreta.');
        }
        const secretKey = process.env.secretKey;
        const token = jsonwebtoken_1.default.sign({
            UserId: user.ID,
            nomeCompleto: user.NomeCompleto,
            email: user.Email,
            Telefone: user.Telefone,
            Bairro: user.Bairro,
            DataNascimento: user.DataNascimento,
            paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
            idServicoComunitario: user.IDServicoComunitario,
        }, secretKey, { expiresIn: '3h' });
        const expiration = new Date(new Date().getTime() + 10800000);
        const tokenQuery = 'INSERT INTO Tokens (UserID, Token, Expiracao) VALUES ($1, $2, $3)';
        yield pool.query(tokenQuery, [user.ID, token, expiration]);
        console.log('Token gerado:', token);
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
exports.login = login;
const cadastrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario } = req.body;
    try {
        const senhaHash = yield bcrypt_1.default.hash(req.body.senha, 10);
        const query = 'INSERT INTO Usuarios (NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, SenhaHash, IDServicoComunitario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
        yield pool.query(query, [NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, senhaHash, IDServicoComunitario]);
        res.json({ message: 'Usuário cadastrado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.cadastrarUsuario = cadastrarUsuario;
const getServicosComunitarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM ServicosComunitarios';
        const { rows } = yield pool.query(query);
        res.json(rows);
    }
    catch (error) {
        console.error('Erro ao buscar serviços comunitários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getServicosComunitarios = getServicosComunitarios;
const editarPerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const query = 'SELECT * FROM Usuarios WHERE ID = $1';
        const userResult = yield pool.query(query, [decodedToken.UserId]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const user = userResult.rows[0];
        const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, NovaSenha } = req.body;
        if (NomeCompleto) {
            user.NomeCompleto = NomeCompleto;
        }
        if (Email) {
            user.Email = Email;
        }
        if (Telefone) {
            user.Telefone = Telefone;
        }
        if (Bairro) {
            user.Bairro = Bairro;
        }
        if (ParoquiaMaisFrequentada) {
            user.ParoquiaMaisFrequentada = ParoquiaMaisFrequentada;
        }
        if (DataNascimento) {
            user.DataNascimento = DataNascimento;
        }
        if (IDServicoComunitario) {
            user.IDServicoComunitario = IDServicoComunitario;
        }
        if (NovaSenha) {
            const senhaHash = yield bcrypt_1.default.hash(NovaSenha, 10);
            user.SenhaHash = senhaHash;
        }
        const updateQuery = 'UPDATE Usuarios SET NomeCompleto = $1, Email = $2, Telefone = $3, Bairro = $4, ParoquiaMaisFrequentada = $5, DataNascimento = $6, IDServicoComunitario = $7, SenhaHash = $8 WHERE ID = $9';
        yield pool.query(updateQuery, [user.NomeCompleto, user.Email, user.Telefone, user.Bairro, user.ParoquiaMaisFrequentada, user.DataNascimento, user.IDServicoComunitario, user.SenhaHash, user.ID]);
        res.json({ message: 'Perfil atualizado com sucesso' });
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});
exports.editarPerfil = editarPerfil;
const getUsuarioLogado = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const secretKey = process.env.secretKey;
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const query = 'SELECT * FROM Usuarios WHERE ID = $1';
        const userResult = yield pool.query(query, [decodedToken.UserId]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const user = userResult.rows[0];
        const userData = {
            UserId: decodedToken.UserId,
            nomeCompleto: user.NomeCompleto,
            email: user.Email,
            telefone: user.Telefone,
            bairro: user.Bairro,
            dataNascimento: user.DataNascimento,
            paroquiaMaisFrequentada: user.ParoquiaMaisFrequentada,
            idServicoComunitario: user.IDServicoComunitario,
        };
        res.json(userData);
        console.log(userData);
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
});
exports.getUsuarioLogado = getUsuarioLogado;
