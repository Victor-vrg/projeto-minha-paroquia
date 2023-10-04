import express from 'express';
import cors from 'cors';
import paroquiasRoutes from './routes/paroquiaRoute';
import eventosRoute from './routes/EventosRoute';
import ExcursaoRoute from './routes/ExcursaoRoute';
import { Database } from 'sqlite'; 
import { initializeDatabase } from './database/db'; 

const app = express();
const port = 3001;


// Middleware
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await initializeDatabase();

    // Roteadores
    app.use('/api', paroquiasRoutes);
    app.use('/eventos/eventos-recentes', eventosRoute);
    app.use('/destaque', eventosRoute);
    app.use('/eventos', eventosRoute);
    app.use('/destaqueEx', ExcursaoRoute);
    app.use('/excursao', ExcursaoRoute);

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

startServer();