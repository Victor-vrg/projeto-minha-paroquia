"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EventosController_1 = require("../controllers/EventosController");
const router = express_1.default.Router();
router.get('/destaque', EventosController_1.getEventosDestacados);
router.get('/eventos', EventosController_1.getEventos);
exports.default = router;
