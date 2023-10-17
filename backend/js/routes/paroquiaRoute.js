"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paroquiacontrole_1 = require("../controllers/paroquiacontrole");
const router = (0, express_1.Router)();
router.get('/paroquias', paroquiacontrole_1.obterSugestoesParoquias);
router.get('/paroquias-nome/:nomeParoquia', paroquiacontrole_1.obterParoquiaPorNome);
exports.default = router;
