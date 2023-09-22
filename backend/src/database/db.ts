import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function openDatabase(): Promise<Database> {
  try {
    const db = await open({
      filename: './minha-paroquia-db.sqlite3', 
      driver: sqlite3.Database,
    });
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    return db;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error; 
  }
}
