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
const db_1 = require("../database/db");
const EventosController_1 = require("../controllers/EventosController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/destaque', EventosController_1.getEventosDestacados);
router.get('/eventos', EventosController_1.getEventos);
router.get('/eventos-recentes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, db_1.getDatabaseInstance)();
        console.log('Rota de eventos-recentes acessada');
        const eventosRecentes = yield db.all('SELECT * FROM Eventos LIMIT 10');
        console.log('Eventos recentes:', eventosRecentes);
        res.json(eventosRecentes);
    }
    catch (error) {
        console.error('Erro ao buscar eventos recentes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}));
exports.default = router;
