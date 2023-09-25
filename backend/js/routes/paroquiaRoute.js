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
const express_1 = require("express");
const db_1 = __importDefault(require("../database/db"));
const router = (0, express_1.Router)();
const dbPromise = (0, db_1.default)();
router.get('/paroquias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield dbPromise;
        const searchText = req.query.s;
        if (!searchText.trim()) {
            res.status(400).json({ error: 'Texto de busca inválido' });
            return;
        }
        // Consulta SQL para buscar sugestões de paróquias
        const query = `
      SELECT NomeParoquia
      FROM Paroquias
      WHERE NomeParoquia LIKE ?;
    `;
        const searchValue = `%${searchText}%`;
        const sugestoes = yield db.all(query, [searchValue]);
        res.json(sugestoes);
    }
    catch (error) {
        console.error('Erro ao buscar sugestões de paróquias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
exports.default = router;