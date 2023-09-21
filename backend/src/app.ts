
import express from 'express';
import openDatabase from './database/db'; 


const app = express();
const port = 3000; 

// Rota para buscar uma paróquia com base no nome
app.get('/buscar-paroquia', async (req, res) => {
  try {
    const db = await openDatabase();

    
    const { nomeParoquia } = req.query;

    // Consulta SQL para buscar a paróquia pelo nome
    const query = `SELECT * FROM Paroquias WHERE NomeParoquia LIKE ?`;

    // Execute a consulta
    const paroquias = await db.all(query, [`%${nomeParoquia}%`]);

    // Feche a conexão com o banco de dados
    await db.close();

    // Retorne as paróquias encontradas como JSON
    res.json(paroquias);
  } catch (error) {
    console.error('Erro ao buscar paróquia:', error);
    res.status(500).json({ error: 'Erro ao buscar paróquia' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
