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
exports.verificarTokenRecuperacao = exports.enviarEmailRecuperacao = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
const db_1 = require("../database/db");
const enviarEmailRecuperacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const user = yield db.get('SELECT * FROM Usuarios WHERE Email = ?', [email]);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        // Gere um token de recuperação
        const token = generateRandomToken();
        yield db.run('INSERT INTO Tokens (UserID, Token, Expiracao) VALUES (?, ?, ?)', [user.ID, token, new Date(new Date().getTime() + 3600000)]);
        const transporter = config_1.EmailParoquia;
        const mailOptions = {
            from: config_1.Emailuser,
            to: email,
            subject: 'Recuperação de Senha',
            text: `Use o código a seguir para recuperar sua senha: ${token}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar o email:', error);
                res.status(500).json({ error: 'Erro ao enviar o email de recuperação.' });
            }
            else {
                res.json({ message: 'Email de recuperação enviado com sucesso.' });
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
exports.enviarEmailRecuperacao = enviarEmailRecuperacao;
const verificarTokenRecuperacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, novaSenha } = req.body;
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const tokenInfo = yield db.get('SELECT * FROM Tokens WHERE Token = ? AND Expiracao >= ?', [token, new Date()]);
        if (!tokenInfo) {
            throw new Error('Token inválido ou expirado.');
        }
        // Atualize a senha do usuário
        const senhaHash = yield bcrypt_1.default.hash(novaSenha, 10);
        yield db.run('UPDATE Usuarios SET SenhaHash = ? WHERE ID = ?', [senhaHash, tokenInfo.UserID]);
        // Remova o token de recuperação após o uso
        yield db.run('DELETE FROM Tokens WHERE Token = ?', [token]);
        res.json({ message: 'Senha redefinida com sucesso.' });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
exports.verificarTokenRecuperacao = verificarTokenRecuperacao;
function generateRandomToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const tokenLength = 8;
    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    return token;
}
