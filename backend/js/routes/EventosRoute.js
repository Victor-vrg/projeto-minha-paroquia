"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EventosController_1 = require("../controllers/EventosController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.get('/destaque', EventosController_1.getEventosDestacados);
router.get('/eventos', EventosController_1.getEventos);
router.post('/criar', middleware_1.verifyToken, (req, res, next) => {
    const { IDServicoComunitario } = req.body;
    const permissionsPromises = IDServicoComunitario.map((IDServicoComunitario) => {
        return new Promise((resolve, reject) => {
            (0, middleware_1.checkUserAccess)(IDServicoComunitario)(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
    Promise.all(permissionsPromises)
        .then(() => {
        // Se todas as verificações de permissão passarem, crie o evento.
        (0, EventosController_1.createEvento)(req, res, next);
    })
        .catch((error) => {
        // Se uma das verificações de permissão falhar, retorne um erro de acesso não autorizado.
        res.status(403).json({ error: 'Acesso não autorizado para este serviço comunitário' });
    });
});
exports.default = router;
