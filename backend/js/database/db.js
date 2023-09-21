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
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const databasePath = './minha-paroquia-db.sqlite';
function openDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield open({
                filename: databasePath,
                driver: sqlite3.Database,
            });
            console.log('Conexão com o banco de dados SQLite aberta com sucesso.');
            return db;
        }
        catch (error) {
            console.error('Erro ao abrir conexão com o banco de dados SQLite:', error);
            throw error;
        }
    });
}
exports.default = openDatabase;
