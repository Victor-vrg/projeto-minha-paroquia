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
exports.getDatabaseInstance = exports.initializeDatabase = exports.dbInstance = void 0;
const pg_1 = require("pg");
require('dotenv').config();
const connectionString = process.env.DB_CONNECTION;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const DB_PASS = process.env.DB_PASS;
const client = new pg_1.Client({
    connectionString: connectionString,
    user: DB_USER,
    host: DB_HOST,
    database: DATABASE,
    password: DB_PASS,
    port: 5432,
});
exports.dbInstance = null;
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        exports.dbInstance = client;
        console.log('Conexão com o banco de dados PostgreSQL estabelecida!');
        yield createTables();
        yield insertTestData();
        console.log('Dados de teste inseridos com sucesso!');
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
});
exports.initializeDatabase = initializeDatabase;
const getDatabaseInstance = () => {
    if (!exports.dbInstance) {
        throw new Error('Banco de dados não inicializado.');
    }
    return exports.dbInstance;
};
exports.getDatabaseInstance = getDatabaseInstance;
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (exports.dbInstance === null || exports.dbInstance === void 0 ? void 0 : exports.dbInstance.query(`
    CREATE TABLE IF NOT EXISTS Paroquias (
      ID                    SERIAL PRIMARY KEY,
      NomeParoquia          VARCHAR(255) NOT NULL,
      Padres                VARCHAR(255),
      CEP                   VARCHAR(10) NOT NULL,
      LocalizacaoParoquia   VARCHAR(255),
      Bairro                VARCHAR(255),
      InformacoesAdicionais TEXT,
      EmailResponsavel      VARCHAR(255) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS ServicosComunitarios (
    ID                     SERIAL PRIMARY KEY,
    nomeServicoComunitario VARCHAR(150),
    DescricaoServico       VARCHAR(255),
    ObjetivosServico       TEXT,
    PublicoAlvoServico     VARCHAR(255),
    TipoServicoComunitario VARCHAR(150),
    ParoquiaID             INT,
    Ativo                  BOOLEAN,
    FOREIGN KEY (ParoquiaID) REFERENCES Paroquias (ID)
);
  CREATE TABLE IF NOT EXISTS Usuarios (
    ID                      SERIAL PRIMARY KEY,
    NomeCompleto            VARCHAR(255) NOT NULL,
    Email                   VARCHAR(255) NOT NULL,
    Telefone                VARCHAR(20),
    Bairro                  VARCHAR(255),
    DataNascimento          DATE,
    ParoquiaMaisFrequentada INT,
    IDServicoComunitario    INT,
    SenhaHash               VARCHAR(255) NOT NULL,
    FOREIGN KEY (ParoquiaMaisFrequentada) REFERENCES Paroquias (ID),
    FOREIGN KEY (IDServicoComunitario) REFERENCES ServicosComunitarios (ID)
);
    
  
    CREATE TABLE IF NOT EXISTS Feedback (
        ID             SERIAL PRIMARY KEY,
        NomeUsuario    VARCHAR(255) NOT NULL,
        Email          VARCHAR(255) NOT NULL,
        Mensagem       TEXT,
        DataEnvio      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS Eventos (
        ID                SERIAL PRIMARY KEY,
        NomeEvento        VARCHAR(255) NOT NULL,
        DataInicio        DATE,
        DataFim           DATE,
        HoraInicio        TIME,
        HoraFim           TIME,
        LocalizacaoEvento VARCHAR(255),
        DescricaoEvento   TEXT,
        CaminhoImagem     VARCHAR(255),
        TipoEvento        VARCHAR(150),
        Participacao      TEXT CHECK (Participacao IN ('Sim', 'Talvez', 'Não')),
        Destaque          INTEGER DEFAULT 0,
        Ocultar           INTEGER DEFAULT 0,
        ParoquiaID        INT
    );
    
    CREATE TABLE IF NOT EXISTS EventosServicosComunitarios (
        EventoID             INT,
        ServicoComunitarioID INT,
        PRIMARY KEY (EventoID, ServicoComunitarioID),
        FOREIGN KEY (EventoID) REFERENCES Eventos (ID),
        FOREIGN KEY (ServicoComunitarioID) REFERENCES ServicosComunitarios (ID)
    );
    

    CREATE TABLE IF NOT EXISTS Excursoes (
        ID                  SERIAL PRIMARY KEY,
        NomeExcursao        VARCHAR(255),
        DescricaoExcursao   TEXT,
        DataInicioExcursao  DATE,
        DataFimExcursao     DATE,
        HoraInicioExcursao  TIME,
        HoraFimExcursao     TIME,
        LocalizacaoExcursao VARCHAR(255),
        PrecoExcursao       FLOAT,
        VagasExcursao       INTEGER,
        ParoquiaID          INT,
        CaminhoImagem       VARCHAR(255),
        Destaque            INTEGER DEFAULT 0,
        Ocultar             INTEGER DEFAULT 0,
        FOREIGN KEY (ParoquiaID) REFERENCES Paroquias (ID)
    );
    
    CREATE TABLE IF NOT EXISTS Inscricoes (
        ID                   SERIAL PRIMARY KEY,
        UsuarioID            INT,
        ServicoComunitarioID INT,
        DataInscricao        DATE,
        FOREIGN KEY (UsuarioID) REFERENCES Usuarios (ID),
        FOREIGN KEY (ServicoComunitarioID) REFERENCES ServicosComunitarios (ID)
    );
    
   
    
    CREATE TABLE IF NOT EXISTS ParticipacoesEventos (
        ID           SERIAL PRIMARY KEY,
        UsuarioID    INTEGER,
        EventoID     INTEGER,
        Participacao TEXT CHECK (Participacao IN ('Sim', 'Talvez', 'Não')),
        FOREIGN KEY (UsuarioID) REFERENCES Usuarios (ID),
        FOREIGN KEY (EventoID) REFERENCES Eventos (ID)
    );
    
    CREATE TABLE IF NOT EXISTS SolicitacoesServicosComunitarios (
        ID                    SERIAL PRIMARY KEY,
        NomeServicoComunitario VARCHAR(255) NOT NULL,
        DescricaoServico       VARCHAR(255),
        ObjetivosServico       TEXT,
        PublicoAlvoServico     VARCHAR(255),
        StatusSolicitacao      VARCHAR(50) DEFAULT 'Pendente', -- Pode ser 'Pendente', 'Aprovada' ou 'Rejeitada'
        JustificativaAprovacao TEXT,
        SolicitanteID          INT, -- ID do usuário que fez a solicitação
        DataSolicitacao        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
   
    CREATE TABLE IF NOT EXISTS ExcursaoServicoComunitario (
        ExcursaoID              INT,
        ServicoComunitarioID    INT,
        PRIMARY KEY (ExcursaoID, ServicoComunitarioID),
        FOREIGN KEY (ExcursaoID) REFERENCES Excursoes (ID),
        FOREIGN KEY (ServicoComunitarioID) REFERENCES ServicosComunitarios (ID)
    );
    
    CREATE TABLE IF NOT EXISTS Tokens (
        ID        SERIAL PRIMARY KEY,
        UserID    INT,
        Token     VARCHAR(255),
        Expiracao TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Usuarios (ID)
    );
    
    
    
    CREATE TABLE IF NOT EXISTS LogAtividades (
        ID               SERIAL PRIMARY KEY,
        UsuarioID        INT,
        DataHora         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        TipoAcao         VARCHAR(255),
        RecursoAfetado   VARCHAR(255),
        DetalhesAcao     TEXT,
        FOREIGN KEY (UsuarioID) REFERENCES Usuarios (ID)
    );
    
    CREATE TABLE IF NOT EXISTS UsuariosServicosComunitarios (
        ID                     SERIAL PRIMARY KEY,
        UsuarioID              INT,
        nomeServicoComunitario VARCHAR(255),
        ServicoComunitarioID   INT,
        NivelAcessoNoServico   INT,
        FOREIGN KEY (UsuarioID) REFERENCES Usuarios (ID),
        FOREIGN KEY (ServicoComunitarioID) REFERENCES ServicosComunitarios (ID)
    );
    

    `));
        console.log('Tabelas criadas com sucesso.');
    }
    catch (error) {
        console.error('Erro na criação das tabelas:', error);
        throw error;
    }
});
const insertTestData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Dados de teste inseridos com sucesso!');
    }
    catch (error) {
        console.error('Erro ao inserir dados de teste:', error);
        throw error;
    }
});
