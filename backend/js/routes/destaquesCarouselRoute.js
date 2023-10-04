"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const destaquesCarouselController_1 = require("../controllers/destaquesCarouselController");
const router = express_1.default.Router();
router.get('/api/carrossel', destaquesCarouselController_1.getdestaquesCarouselItems);
exports.default = router;
