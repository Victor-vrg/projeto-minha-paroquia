"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const ServicoComunitarioController_1 = require("../controllers/ServicoComunitarioController");
const router = express_1.default.Router();
router.get('/niveis-de-acesso', middleware_1.verifyToken, ServicoComunitarioController_1.getallNivelAcessoUsuario); // pega todos niveis de acesso
router.get('/niveis-abaixode5', middleware_1.verifyToken, ServicoComunitarioController_1.NivelAcessoUsuarioAbaixode5); //abaixo de nivel 5 pode criar algo em algum serviço-comunitario
exports.default = router;
