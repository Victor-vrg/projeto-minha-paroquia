"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/login', userController_1.login);
router.get('/getUsers', userController_1.getUsers);
router.post('/cadastrar', userController_1.cadastrarUsuario);
router.get('/servicos-comunitarios', userController_1.getServicosComunitarios);
exports.default = router;
