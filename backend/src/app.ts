import express from 'express';
import cors from 'cors';
import paroquiasRoutes from './routes/paroquiaRoute';
import ParoquiaModel from './models/paroquiaModel';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Roteadores
app.use('/api', paroquiasRoutes);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
