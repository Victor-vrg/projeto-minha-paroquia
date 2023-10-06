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
exports.getDatabaseInstance = exports.initializeDatabase = exports.dbInstance = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const DATABASE_FILE = path_1.default.join(__dirname, '../basedeteste.sqlite3');
exports.dbInstance = null;
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.dbInstance = yield (0, sqlite_1.open)({
            filename: DATABASE_FILE,
            driver: sqlite3_1.default.Database,
        });
        console.log('Conexão com o banco de dados SQLite3 estabelecida!');
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
        yield (exports.dbInstance === null || exports.dbInstance === void 0 ? void 0 : exports.dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS Eventos (
        ID                INTEGER       PRIMARY KEY AUTOINCREMENT,
        NomeEvento        VARCHAR (255) NOT NULL,
        DataInicio        DATE,
        DataFim           DATE,
        HoraInicio        TIME,
        HoraFim           TIME,
        LocalizacaoEvento VARCHAR (255),
        DescricaoEvento   TEXT,
        CaminhoImagem     VARCHAR (255),
        TipoEvento        VARCHAR (150),
        Participacao      TEXT          CHECK (Participacao IN ('Sim', 'Talvez', 'Não') ),
        Destaque          INTEGER       DEFAULT 0,
        ParoquiaID        INT
    );
    
    CREATE TABLE IF NOT EXISTS Eventos_ServicosComunitarios (
        EventoID             INT,
        ServicoComunitarioID INT,
        PRIMARY KEY (
            EventoID,
            ServicoComunitarioID
        ),
        FOREIGN KEY (
            EventoID
        )
        REFERENCES Eventos (ID),
        FOREIGN KEY (
            ServicoComunitarioID
        )
        REFERENCES ServicosComunitarios (ID) 
    );
    
    CREATE TABLE IF NOT EXISTS Excursoes (
        ID                  INTEGER       PRIMARY KEY AUTOINCREMENT,
        NomeExcursao        VARCHAR (255),
        DescricaoExcursao   TEXT,
        DataInicioExcursao  DATE,
        DataFimExcursao     DATE,
        HoraInicioExcursao  TIME,
        HoraFimExcursao     TIME,
        LocalizacaoExcursao VARCHAR (255),
        PrecoExcursao       FLOAT,
        VagasExcursao       INTEGER,
        ParoquiaID          INT,
        CaminhoImagem       VARCHAR (255),
        Destaque            INTEGER       DEFAULT 0,
        FOREIGN KEY (
            ParoquiaID
        )
        REFERENCES Paroquias (ID) 
    );
    
    CREATE TABLE IF NOT EXISTS Inscricoes (
        ID                   INTEGER PRIMARY KEY AUTOINCREMENT,
        UsuarioID            INT,
        ServicoComunitarioID INT,
        DataInscricao        DATE,
        FOREIGN KEY (
            UsuarioID
        )
        REFERENCES Usuarios (ID),
        FOREIGN KEY (
            ServicoComunitarioID
        )
        REFERENCES ServicosComunitarios (ID) 
    );
    
    CREATE TABLE IF NOT EXISTS Paroquias (
        ID                    INTEGER       PRIMARY KEY AUTOINCREMENT,
        NomeParoquia          VARCHAR (255) NOT NULL,
        Padres                VARCHAR (255),
        CEP                   VARCHAR (10)  NOT NULL,
        LocalizacaoParoquia   VARCHAR (255),
        Bairro                VARCHAR (255),
        InformacoesAdicionais TEXT,
        EmailResponsavel      VARCHAR (255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS ParticipacoesEventos (
        ID           INTEGER PRIMARY KEY AUTOINCREMENT,
        UsuarioID    INTEGER,
        EventoID     INTEGER,
        Participacao TEXT    CHECK (Participacao IN ('Sim', 'Talvez', 'Não') ),
        FOREIGN KEY (
            UsuarioID
        )
        REFERENCES Usuarios (ID),
        FOREIGN KEY (
            EventoID
        )
        REFERENCES Eventos (ID) 
    );
    
    CREATE TABLE IF NOT EXISTS ServicosComunitarios (
        ID                     INTEGER       PRIMARY KEY AUTOINCREMENT,
        ServicoComunitario     VARCHAR (150),
        DescricaoServico       VARCHAR (255),
        ObjetivosServico       TEXT,
        PublicoAlvoServico     VARCHAR (255),
        TipoServicoComunitario VARCHAR (150),
        ParoquiaID             INT,
        Ativo                  BOOLEAN,
        FOREIGN KEY (
            ParoquiaID
        )
        REFERENCES Paroquias (ID) 
    );
    
    CREATE TABLE IF NOT EXISTS Tokens (
        ID        INTEGER       PRIMARY KEY AUTOINCREMENT,
        UserID    INT,
        Token     VARCHAR (255),
        Expiracao TIMESTAMP,
        FOREIGN KEY (
            UserID
        )
        REFERENCES Usuarios (ID) 
    );
    
    CREATE TABLE IF NOT EXISTS Usuarios (
        ID                      INTEGER       PRIMARY KEY AUTOINCREMENT,
        NomeCompleto            VARCHAR (255) NOT NULL,
        Email                   VARCHAR (255) NOT NULL,
        Telefone                VARCHAR (20),
        Bairro                  VARCHAR (255),
        DataNascimento          DATE,
        ParoquiaMaisFrequentada INT,
        NivelAcesso             INT,
        IDServicoComunitario    INT,
        SenhaHash               VARCHAR (255) NOT NULL,
        Cargo                   VARCHAR (150),-- Senha criptografada
        FOREIGN KEY (
            ParoquiaMaisFrequentada
        )
        REFERENCES Paroquias (ID),
        FOREIGN KEY (
            IDServicoComunitario
        )
        REFERENCES ServicosComunitarios (ID) 
    );
    `));
        yield (exports.dbInstance === null || exports.dbInstance === void 0 ? void 0 : exports.dbInstance.exec(`
    -- Índice: idx_data_inicio_evento
    CREATE INDEX IF NOT EXISTS idx_data_inicio_evento ON Eventos (
        DataInicio
    );
    
    -- Índice: idx_data_inicio_excursao
    CREATE INDEX IF NOT EXISTS idx_data_inicio_excursao ON Excursoes (
        DataInicioExcursao
    );
    
    -- Índice: idx_email_usuario
    CREATE INDEX IF NOT EXISTS idx_email_usuario ON Usuarios (
        Email
    );
    
    -- Índice: idx_evento_participacao
    CREATE INDEX IF NOT EXISTS idx_evento_participacao ON ParticipacoesEventos (
        EventoID
    );
    
    -- Índice: idx_nome_evento
    CREATE INDEX IF NOT EXISTS idx_nome_evento ON Eventos (
        NomeEvento
    );
    
    -- Índice: idx_nome_excursao
    CREATE INDEX IF NOT EXISTS idx_nome_excursao ON Excursoes (
        NomeExcursao
    );
    
    -- Índice: idx_nome_paroquia
    CREATE INDEX IF NOT EXISTS idx_nome_paroquia ON Paroquias (
        NomeParoquia
    );
    
    -- Índice: idx_nome_usuario
    CREATE INDEX IF NOT EXISTS idx_nome_usuario ON Usuarios (
        NomeCompleto
    );
    
    -- Índice: idx_servico_comunitario
    CREATE INDEX IF NOT EXISTS idx_servico_comunitario ON ServicosComunitarios (
        ServicoComunitario
    );
    
    -- Índice: idx_tipo_servico
    CREATE INDEX IF NOT EXISTS idx_tipo_servico ON ServicosComunitarios (
        TipoServicoComunitario
    );
    
    -- Índice: idx_usuario_participacao
    CREATE INDEX IF NOT EXISTS idx_usuario_participacao ON ParticipacoesEventos (
        UsuarioID
    );
    `));
    }
    catch (error) {
        console.error('Erro ao criar tabelas:', error);
        throw error;
    }
});
const insertTestData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Inserir novos dados de teste- ja temos paroquia,eventos,serviços de testes!
        yield (exports.dbInstance === null || exports.dbInstance === void 0 ? void 0 : exports.dbInstance.exec(`
    `));
        console.log('Dados de teste inseridos com sucesso!');
    }
    catch (error) {
        console.error('Erro ao inserir dados de teste:', error);
        throw error;
    }
});
