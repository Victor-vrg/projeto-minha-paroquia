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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const paroquiaRoute_1 = __importDefault(require("./routes/paroquiaRoute"));
const EventosRoute_1 = __importDefault(require("./routes/EventosRoute"));
const ExcursaoRoute_1 = __importDefault(require("./routes/ExcursaoRoute"));
const db_1 = require("./database/db");
const app = (0, express_1.default)();
const port = 3001;
const path = require('path');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/public', express_1.default.static(path.join(__dirname, 'public')));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.initializeDatabase)();
        // Roteadores
        app.use('/api', paroquiaRoute_1.default);
        app.use('/destaque', EventosRoute_1.default);
        app.use('/eventos', EventosRoute_1.default);
        app.use('/destaqueEx', ExcursaoRoute_1.default);
        app.use('/excursao', ExcursaoRoute_1.default);
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
    catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
});
startServer();
