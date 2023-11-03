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
const nodemailer_1 = __importDefault(require("nodemailer"));
const pg_1 = require("pg");
const emailService = process.env.EMAIL_SERVICE;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASS,
    port: 5432,
});
const enviarEmailRecuperacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const client = yield pool.connect();
        const user = yield client.query('SELECT * FROM Usuarios WHERE Email = $1', [email]);
        client.release();
        if (user.rowCount === 0) {
            throw new Error('Usuário não encontrado.');
        }
        // Gere um token de recuperação
        const token = generateRandomToken();
        const expiracao = new Date(new Date().getTime() + 3600000);
        const client2 = yield pool.connect();
        yield client2.query('INSERT INTO Tokens (UserID, Token, Expiracao) VALUES ($1, $2, $3)', [user.rows[0].id, token, expiracao]);
        client2.release();
        const transporter = nodemailer_1.default.createTransport({
            service: emailService,
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
        const mailOptions = {
            from: emailUser,
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
        const client = yield pool.connect();
        const tokenInfo = yield client.query('SELECT * FROM Tokens WHERE Token = $1 AND Expiracao >= $2', [token, new Date()]);
        if (tokenInfo.rowCount === 0) {
            throw new Error('Token inválido ou expirado.');
        }
        const senhaHash = yield bcrypt_1.default.hash(novaSenha, 10);
        yield client.query('UPDATE Usuarios SET SenhaHash = $1 WHERE ID = $2', [senhaHash, tokenInfo.rows[0].userid]);
        yield client.query('DELETE FROM Tokens WHERE Token = $1', [token]);
        client.release();
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
