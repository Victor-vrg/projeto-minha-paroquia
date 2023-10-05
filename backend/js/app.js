"use strict";
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
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const startServer = async () => {
    try {
        await (0, db_1.initializeDatabase)();
        // Roteadores
        app.use('/api', paroquiaRoute_1.default);
        app.use('/eventos/eventos-recentes', EventosRoute_1.default);
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
};
startServer();
