"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db"); // Importe a instância do banco de dados
const router = (0, express_1.Router)();
router.get('/paroquias', async (req, res) => {
    try {
        const searchText = req.query.s;
        if (!searchText.trim()) {
            res.status(400).json({ error: 'Texto de busca inválido' });
            return;
        }
        const query = `
      SELECT NomeParoquia
      FROM Paroquias
      WHERE NomeParoquia LIKE ?;
    `;
        const searchValue = `%${searchText}%`;
        const db = (0, db_1.getDatabaseInstance)();
        const sugestoes = await db.all(query, [searchValue]);
        res.json(sugestoes);
    }
    catch (error) {
        console.error('Erro ao buscar sugestões de paróquias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.default = router;
