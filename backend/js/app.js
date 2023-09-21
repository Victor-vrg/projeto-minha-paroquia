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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./database/db"));
const app = (0, express_1.default)();
const port = 3000;
// Rota para buscar uma paróquia com base no nome
app.get('/buscar-paroquia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.default)();
        const { nomeParoquia } = req.query;
        // Consulta SQL para buscar a paróquia pelo nome
        const query = `SELECT * FROM Paroquias WHERE NomeParoquia LIKE ?`;
        // Execute a consulta
        const paroquias = yield db.all(query, [`%${nomeParoquia}%`]);
        // Feche a conexão com o banco de dados
        yield db.close();
        // Retorne as paróquias encontradas como JSON
        res.json(paroquias);
    }
    catch (error) {
        console.error('Erro ao buscar paróquia:', error);
        res.status(500).json({ error: 'Erro ao buscar paróquia' });
    }
}));
// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
