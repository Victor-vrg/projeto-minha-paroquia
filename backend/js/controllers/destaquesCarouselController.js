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
exports.getdestaquesCarouselItems = void 0;
const getdestaquesCarouselItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = req.app.locals.db;
        const destaques = yield db.all('SELECT * FROM Eventos WHERE Destaques = 1');
        res.json(destaques);
    }
    catch (error) {
        console.error('Erro ao buscar destaques:', error);
        res.status(500).json({ message: 'Erro ao buscar destaques.' });
    }
});
exports.getdestaquesCarouselItems = getdestaquesCarouselItems;
