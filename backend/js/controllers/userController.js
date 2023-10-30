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
exports.editarPerfil = exports.getServicosComunitarios = exports.cadastrarUsuario = exports.login = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const db_1 = require("../database/db");
// Controlador para buscar todos os usuários
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const users = yield db.all('SELECT * FROM Usuarios');
        res.json(users);
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
        // Verifique se NomeCompleto ou Email foram fornecidos
        if (!NomeCompleto && !Email) {
            throw new Error('Nome Completo ou Email são necessários.');
        }
        const db = (0, db_1.getDatabaseInstance)();
        const User = yield db.get('SELECT * FROM Usuarios WHERE NomeCompleto = ? OR Email = ?', [NomeCompleto, Email]);
        if (!User) {
            throw new Error('Usuário não encontrado.');
        }
        // Verifique a senha
        const passwordMatch = yield bcrypt_1.default.compare(senha, User.SenhaHash);
        if (!passwordMatch) {
            throw new Error('Senha incorreta.');
        }
        // Gere um token JWT para autenticar o usuário
        const token = jsonwebtoken_1.default.sign({
            UserId: User.ID,
            nomeCompleto: User.NomeCompleto,
            email: User.Email,
            paroquiaMaisFrequentada: User.ParoquiaMaisFrequentada,
            idServicoComunitario: User.IDServicoComunitario,
        }, config_1.secretKey, { expiresIn: '3h' });
        yield db.run('INSERT INTO Tokens (UserID, Token, Expiracao) VALUES (?, ?, ?)', [User.ID, token, new Date(new Date().getTime() + 10800000)]);
        // Envie o token como resposta
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
        const db = (0, db_1.getDatabaseInstance)();
        yield db.run('INSERT INTO Usuarios (NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, SenhaHash, IDServicoComunitario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, senhaHash, IDServicoComunitario]);
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
        const db = (0, db_1.getDatabaseInstance)();
        const servicosComunitarios = yield db.all('SELECT * FROM ServicosComunitarios');
        res.json(servicosComunitarios);
    }
    catch (error) {
        console.error('Erro ao buscar serviços comunitários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getServicosComunitarios = getServicosComunitarios;
const editarPerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { UserId } = req.user;
    // Você deve extrair o ID do usuário do token
    const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario } = req.body;
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const existingUser = yield db.get('SELECT * FROM Usuarios WHERE ID = ?', [UserId]);
        if (!existingUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        // Implemente a lógica para atualizar o perfil do usuário no banco de dados
        yield db.run('UPDATE Usuarios SET NomeCompleto = ?, Email = ?, Telefone = ?, Bairro = ?, ParoquiaMaisFrequentada = ?, DataNascimento = ?, IDServicoComunitario = ? WHERE ID = ?', [NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, UserId]);
        res.json({ message: 'Perfil atualizado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao editar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.editarPerfil = editarPerfil;
