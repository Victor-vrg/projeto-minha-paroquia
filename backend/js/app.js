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
const paroquia_1 = require("./models/paroquia");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, paroquia_1.openDatabaseConnection)();
        // Rota para criar uma nova paróquia
        app.post('/api/paroquias', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel } = req.body;
                const newParoquia = {
                    NomeParoquia,
                    Padres,
                    CEP,
                    LocalizacaoParoquia,
                    Bairro,
                    InformacoesAdicionais,
                    EmailResponsavel,
                };
                yield (0, paroquia_1.createParoquia)(db, newParoquia);
                res.status(201).send('Paróquia criada com sucesso.');
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Erro ao criar paróquia.');
            }
        }));
        // Rota para buscar uma paróquia por nome
        app.get('/api/paroquias', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nome } = req.query;
            if (!nome) {
                return res.status(400).send('Parâmetro "nome" não fornecido.');
            }
            const paroquia = yield (0, paroquia_1.getParoquiaByName)(db, nome.toString());
            if (paroquia) {
                res.json(paroquia);
            }
            else {
                res.status(404).send('Paróquia não encontrada.');
            }
        }));
        app.listen(port, () => {
            console.log(`Servidor está ouvindo na porta ${port}`);
        });
    });
}
start().catch((error) => {
    console.error('Erro ao iniciar o servidor:', error);
});
