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
        // Verifique NomeCompleto ou Email 
        if (!NomeCompleto && !Email) {
            throw new Error('Nome Completo ou Email são necessários.');
        }
        const db = (0, db_1.getDatabaseInstance)();
        const User = yield db.get('SELECT * FROM Usuarios WHERE NomeCompleto = ? OR Email = ?', [NomeCompleto, Email]);
        if (!User) {
            throw new Error('Usuário não encontrado.');
        }
        const passwordMatch = yield bcrypt_1.default.compare(senha, User.SenhaHash);
        if (!passwordMatch) {
            throw new Error('Senha incorreta.');
        }
        const token = jsonwebtoken_1.default.sign({
            UserId: User.ID,
            nomeCompleto: User.NomeCompleto,
            email: User.Email,
            Telefone: User.Telefone,
            Bairro: User.Bairro,
            DataNascimento: User.DataNascimento,
            paroquiaMaisFrequentada: User.ParoquiaMaisFrequentada,
            idServicoComunitario: User.IDServicoComunitario,
        }, config_1.secretKey, { expiresIn: '3h' });
        yield db.run('INSERT INTO Tokens (UserID, Token, Expiracao) VALUES (?, ?, ?)', [User.ID, token, new Date(new Date().getTime() + 10800000)]);
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
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        const db = (0, db_1.getDatabaseInstance)();
        const user = yield db.get('SELECT * FROM Usuarios WHERE ID = ?', [decodedToken.UserId]);
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        // Dados a serem atualizados
        const { NomeCompleto, Email, Telefone, Bairro, ParoquiaMaisFrequentada, DataNascimento, IDServicoComunitario, NovaSenha } = req.body;
        // Verifique se os campos a serem atualizados estão presentes no corpo da solicitação
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
        // Atualize o perfil do usuário no banco de dados
        yield db.run('UPDATE Usuarios SET NomeCompleto = ?, Email = ?, Telefone = ?, Bairro = ?, ParoquiaMaisFrequentada = ?, DataNascimento = ?, IDServicoComunitario = ?, SenhaHash = ? WHERE ID = ?', [user.NomeCompleto, user.Email, user.Telefone, user.Bairro, user.ParoquiaMaisFrequentada, user.DataNascimento, user.IDServicoComunitario, user.SenhaHash, user.ID]);
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
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        const db = (0, db_1.getDatabaseInstance)();
        const user = yield db.get('SELECT * FROM Usuarios WHERE ID = ?', [decodedToken.UserId]);
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        // Você pode ajustar os campos de resposta conforme necessário
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
