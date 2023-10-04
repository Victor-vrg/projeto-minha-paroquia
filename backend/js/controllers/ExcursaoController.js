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
exports.getExcursoes = exports.getExcursoesDestacadas = void 0;
const db_1 = require("../database/db");
const getExcursoesDestacadas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const excursoesDestacadas = yield db.all('SELECT * FROM Excursoes WHERE Destaque > 0');
        res.json(excursoesDestacadas);
    }
    catch (error) {
        console.error('Erro ao buscar excursões destacadas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getExcursoesDestacadas = getExcursoesDestacadas;
const getExcursoes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        const excursao = yield db.all('SELECT * FROM Excursoes ORDER BY DataInicioExcursao, HoraInicioExcursao');
        res.json(excursao);
    }
    catch (error) {
        console.error('Erro ao buscar excursões:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getExcursoes = getExcursoes;
