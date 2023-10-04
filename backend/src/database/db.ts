import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

const DATABASE_FILE = path.join(__dirname, '../minha-paroquia-db.sqlite3');

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    dbInstance = await open({
      filename: DATABASE_FILE,
      driver: sqlite3.Database,
    });

    console.log('Conexão com o banco de dados SQLite3 estabelecida!');
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


