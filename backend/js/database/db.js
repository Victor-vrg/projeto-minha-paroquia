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
exports.getDatabaseInstance = exports.initializeDatabase = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const DATABASE_FILE = path_1.default.join(__dirname, '../minha-paroquia-db.sqlite3');
let dbInstance = null;
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        dbInstance = yield (0, sqlite_1.open)({
            filename: DATABASE_FILE,
            driver: sqlite3_1.default.Database,
        });
        console.log('Conexão com o banco de dados SQLite3 estabelecida!');
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
});
exports.initializeDatabase = initializeDatabase;
const getDatabaseInstance = () => {
    if (!dbInstance) {
        throw new Error('Banco de dados não inicializado.');
    }
    return dbInstance;
};
exports.getDatabaseInstance = getDatabaseInstance;
