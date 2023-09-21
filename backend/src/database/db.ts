const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const databasePath = './minha-paroquia-db.sqlite'; 


async function openDatabase() {
  try {
    const db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    console.log('Conexão com o banco de dados SQLite aberta com sucesso.');
    return db;
  } catch (error) {
    console.error('Erro ao abrir conexão com o banco de dados SQLite:', error);
    throw error;
  }
}

export default openDatabase;


