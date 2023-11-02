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
const config_1 = require("../config");
const db_1 = require("../database/db");
const NivelAcessoUsuarioAbaixode5 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const servicosComunitarios = yield db.all('SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = ? AND NivelAcessoNoServico < 5', [user.ID]);
        res.json(servicosComunitarios);
        console.log(servicosComunitarios);
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
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.secretKey);
        const db = (0, db_1.getDatabaseInstance)();
        const user = yield db.get('SELECT * FROM Usuarios WHERE ID = ?', [decodedToken.UserId]);
        if (!user) {
            return res.status(401).json({ error: 'Usuário associado ao token não encontrado' });
        }
        const servicosComunitarios = yield db.all('SELECT nomeServicoComunitario, ServicoComunitarioID, NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = ?', [user.ID]);
        res.json(servicosComunitarios);
        console.log(servicosComunitarios);
    }
    catch (error) {
        console.error('Erro ao obter nível de acesso do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getallNivelAcessoUsuario = getallNivelAcessoUsuario;
