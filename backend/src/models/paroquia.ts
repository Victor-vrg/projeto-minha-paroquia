import { Interface } from 'readline';
import { open, Database } from 'sqlite';

export interface ParoquiaModel {
  NomeParoquia: string;
  Padres: string;
  CEP: string;
  LocalizacaoParoquia: string;
  Bairro: string;
  InformacoesAdicionais: string;
  EmailResponsavel: string;
}

export async function openDatabaseConnection() {
  const db = await open({
    filename: 'backend/minha-paroquia-db.sqlite3',
    driver: Database,
  });
  return db;
}

export async function createParoquia(db: Database, paroquia: ParoquiaModel) {
  const { NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel } = paroquia;
  return db.run(`
    INSERT INTO Paroquias (NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel]);
}

export async function getParoquiaByName(db: Database, nome: string) {
  return db.get('SELECT * FROM Paroquias WHERE NomeParoquia = ?', [nome]);
}

