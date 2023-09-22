import express from 'express';
import { openDatabaseConnection, createParoquia, getParoquiaByName, ParoquiaModel } from './models/paroquia';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001', //frontend meu
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

async function start() {
  const db = await openDatabaseConnection();

  // Rota para criar uma nova paróquia
  app.post('/api/paroquias', async (req, res) => {
    try {
      const { NomeParoquia, Padres, CEP, LocalizacaoParoquia, Bairro, InformacoesAdicionais, EmailResponsavel } = req.body;
      const newParoquia: ParoquiaModel = {
        NomeParoquia,
        Padres,
        CEP,
        LocalizacaoParoquia,
        Bairro,
        InformacoesAdicionais,
        EmailResponsavel,
      };
      await createParoquia(db, newParoquia);
      res.status(201).send('Paróquia criada com sucesso.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao criar paróquia.');
    }
  });

  // Rota para buscar uma paróquia por nome
  app.get('/api/paroquias', async (req, res) => {
    const { nome } = req.query;
    if (!nome) {
      return res.status(400).send('Parâmetro "nome" não fornecido.');
    }

    const paroquia = await getParoquiaByName(db, nome.toString());
    if (paroquia) {
      res.json(paroquia);
    } else {
      res.status(404).send('Paróquia não encontrada.');
    }
  });

  app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
  });
}

start().catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
});
