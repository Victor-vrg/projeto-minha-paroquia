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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbacks = exports.addFeedback = void 0;
const db_1 = require("../database/db");
const addFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const { NomeUsuario, email, mensagem } = req.body;
        const statement = yield db.prepare('INSERT INTO Feedback (NomeUsuario, email, mensagem) VALUES (?, ?, ?)');
        yield statement.run(NomeUsuario, email, mensagem);
        yield statement.finalize();
        res.status(201).json({ message: 'Feedback adicionado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao adicionar feedback:', error);
        res.status(500).json({ error: 'Erro ao adicionar feedback' });
    }
});
exports.addFeedback = addFeedback;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const feedbacks = yield db.all('SELECT * FROM Feedback ORDER BY ID DESC');
        res.status(200).json(feedbacks);
    }
    catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
        res.status(500).json({ error: 'Erro ao buscar feedbacks' });
    }
});
exports.getFeedbacks = getFeedbacks;
