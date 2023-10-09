import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

const DATABASE_FILE = path.join(__dirname, '../basedeteste.sqlite3');

export let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    dbInstance = await open({
      filename: DATABASE_FILE,
      driver: sqlite3.Database,
    });

    console.log('Conexão com o banco de dados SQLite3 estabelecida!');


    await createTables();
    await insertTestData();

    console.log('Dados de teste inseridos com sucesso!');

  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
};

export const getDatabaseInstance = (): Database<sqlite3.Database, sqlite3.Statement> => {
  if (!dbInstance) {
    throw new Error('Banco de dados não inicializado.');
  }
  return dbInstance;
};

const createTables = async () => {
  try {
    await dbInstance?.exec(`
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
    `);

    
    await dbInstance?.exec(`
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
    `);
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  }
};
const insertTestData = async () => {
    try {
      // Inserir novos dados de teste- ja temos paroquia,eventos,serviços de testes!
    `INSERT INTO Paroquias (ID, NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel) VALUES (1, 'Paroquia Teste', 'Padre Teste', '12345-678', 'Localização da Paroquia Teste', 'Bairro Teste', 'Informações adicionais da Paroquia Teste', 'email@teste.com');
    INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (1, 'Missa da Manhã', '2023-09-28', '2023-09-28', '08:00:00', '09:30:00', 'Igreja Paroquial', 'Missa matinal de domingo.', '/img/eventos/missa.jpg', 'Missa', 'Sim', 1);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (2, 'Missa da Noite', '2023-09-28', '2023-09-28', '18:00:00', '19:30:00', 'Igreja Paroquial', 'Missa noturna de domingo.', NULL, 'Missa', 'Talvez', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (3, 'Catequese Infantil', '2023-09-29', '2023-09-29', '14:00:00', '16:00:00', 'Salão Paroquial', 'Aula de catequese para crianças.', '/img/eventos/catequese.jpg', 'Catequese', 'Sim', 1);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (4, 'Grupo de Jovens', '2023-09-30', '2023-09-30', '19:30:00', '21:00:00', 'Salão Paroquial', 'Reunião do grupo de jovens.', NULL, 'Encontro', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (5, 'Reunião do Conselho Paroquial', '2023-10-02', '2023-10-02', '19:00:00', '21:00:00', 'Salão Paroquial', 'Reunião mensal do conselho paroquial.', NULL, 'Reunião', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (6, 'Adoração Eucarística', '2023-10-04', '2023-10-04', '17:00:00', '18:30:00', 'Igreja Paroquial', 'Hora de adoração ao Santíssimo Sacramento.', NULL, 'Adoração', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (7, 'Limpeza da Igreja', '2023-10-07', '2023-10-07', '09:00:00', '12:00:00', 'Igreja Paroquial', 'Voluntários para limpar a igreja.', NULL, 'Serviço', 'Talvez', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (8, 'Grupo de Oração para Jovens', '2023-10-10', '2023-10-10', '20:00:00', '21:30:00', 'Salão Paroquial', 'Encontro de oração para jovens.', NULL, 'Encontro', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (9, 'Retiro Espiritual', '2023-10-15', '2023-10-16', '09:00:00', '16:00:00', 'Local de Retiro', 'Retiro espiritual de fim de semana.', '/img/eventos/travel.jpg', 'Retiro', 'Não', 1);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (10, 'Reunião do Conselho Paroquial', '2023-10-02', '2023-10-02', '19:00:00', '21:00:00', 'Salão Paroquial', 'Reunião mensal do conselho paroquial.', NULL, 'Reunião', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (11, 'Adoração Eucarística', '2023-10-04', '2023-10-04', '17:00:00', '18:30:00', 'Igreja Paroquial', 'Hora de adoração ao Santíssimo Sacramento.', NULL, 'Adoração', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (12, 'Limpeza da Igreja', '2023-10-07', '2023-10-07', '09:00:00', '12:00:00', 'Igreja Paroquial', 'Voluntários para limpar a igreja.', NULL, 'Serviço', 'Talvez', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (13, 'Grupo de Oração para Jovens', '2023-10-10', '2023-10-10', '20:00:00', '21:30:00', 'Salão Paroquial', 'Encontro de oração para jovens.', NULL, 'Encontro', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (14, 'Retiro Espiritual', '2023-10-15', '2023-10-16', '09:00:00', '16:00:00', 'Local de Retiro', 'Retiro espiritual de fim de semana.', NULL, 'Retiro', 'Não', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (15, 'Reunião do Conselho Paroquial', '2023-10-02', '2023-10-02', '19:00:00', '21:00:00', 'Salão Paroquial', 'Reunião mensal do conselho paroquial.', NULL, 'Reunião', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (16, 'Adoração Eucarística', '2023-10-04', '2023-10-04', '17:00:00', '18:30:00', 'Igreja Paroquial', 'Hora de adoração ao Santíssimo Sacramento.', NULL, 'Adoração', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (17, 'Limpeza da Igreja', '2023-10-07', '2023-10-07', '09:00:00', '12:00:00', 'Igreja Paroquial', 'Voluntários para limpar a igreja.', NULL, 'Serviço', 'Talvez', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (18, 'Grupo de Oração para Jovens', '2023-10-10', '2023-10-10', '20:00:00', '21:30:00', 'Salão Paroquial', 'Encontro de oração para jovens.', NULL, 'Encontro', 'Sim', 0);
INSERT INTO Eventos (ID, NomeEvento, DataInicio, DataFim, HoraInicio, HoraFim, LocalizacaoEvento, DescricaoEvento, CaminhoImagem, TipoEvento, Participacao, Destaque) VALUES (19, 'Retiro Espiritual', '2023-10-15', '2023-10-16', '09:00:00', '16:00:00', 'Local de Retiro', 'Retiro espiritual de fim de semana.', NULL, 'Retiro', 'Não', 0);
`;
      await dbInstance?.exec(`
    `);
  
      console.log('Dados de teste inseridos com sucesso!');
  
    } catch (error) {
      console.error('Erro ao inserir dados de teste:', error);
      throw error;
    }
  };
