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
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const DATABASE_FILE = path_1.default.join(__dirname, '../minha-paroquia-db.sqlite3');
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, sqlite_1.open)({
            filename: DATABASE_FILE,
            driver: sqlite3_1.default.Database,
        });
        yield db.exec(`
      CREATE TABLE IF NOT EXISTS Paroquias (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NomeParoquia VARCHAR(255) NOT NULL,
        Padres VARCHAR(255),
        CEP VARCHAR(10) NOT NULL,
        LocalizacaoParoquia VARCHAR(255),
        Bairro VARCHAR(255),
        InformacoesAdicionais TEXT,
        EmailResponsavel VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ServicosComunitarios (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        ServicoComunitario VARCHAR(150),
        DescricaoServico VARCHAR(255),
        ObjetivosServico TEXT,
        PublicoAlvoServico VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS Usuarios (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NomeCompleto VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL,
        Telefone VARCHAR(20),
        Bairro VARCHAR(255),
        DataNascimento DATE,
        ParoquiaMaisFrequentada INT,
        NivelAcesso INT,
        IDServicoComunitario INT,
        SenhaHash VARCHAR(255) NOT NULL,
        FOREIGN KEY (ParoquiaMaisFrequentada) REFERENCES Paroquias(ID),
        FOREIGN KEY (IDServicoComunitario) REFERENCES ServicosComunitarios(ID)
      );

      CREATE TABLE IF NOT EXISTS Eventos (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        NomeEvento VARCHAR(255) NOT NULL,
        DataInicio DATE,
        DataFim DATE,
        HoraInicio TIME,
        HoraFim TIME,
        LocalizacaoEvento VARCHAR(255),
        DescricaoEvento TEXT,
        CaminhoImagem VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS Eventos_ServicosComunitarios (
        EventoID INT,
        ServicoComunitarioID INT,
        PRIMARY KEY (EventoID, ServicoComunitarioID),
        FOREIGN KEY (EventoID) REFERENCES Eventos(ID),
        FOREIGN KEY (ServicoComunitarioID) REFERENCES ServicosComunitarios(ID)
      );

      CREATE TABLE IF NOT EXISTS Tokens (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        UserID INT,
        Token VARCHAR(255),
        Expiracao TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Usuarios(ID)
      );
    `);
        console.log('Conexão com o banco de dados SQLite3 estabelecida.');
        return db;
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
});
exports.default = initDatabase;
