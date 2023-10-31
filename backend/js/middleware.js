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
exports.checkUserRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const db_1 = require("./database/db");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    console.log('Received token:', token);
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
const checkUserRole = (role, serviceId) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, config_1.secretKey);
            const user = decodedToken;
            // Consulte o banco de dados para verificar o nível de acesso do usuário no serviço comunitário especificado
            const db = (0, db_1.getDatabaseInstance)();
            const userAccess = yield db.get('SELECT NivelAcessoNoServico FROM Usuarios_ServicosComunitarios WHERE UsuarioID = ? AND ServicoComunitarioID = ?', [user.id, serviceId]);
            if (userAccess && userAccess.NivelAcessoNoServico === role) {
                req.user = user;
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
exports.checkUserRole = checkUserRole;
