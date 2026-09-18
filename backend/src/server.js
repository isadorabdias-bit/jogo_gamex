const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares Globais
app.use(cors({
  origin: '*', // Permite requisições do frontend local
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Inicialização do Banco de Dados
initDatabase();

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/stats', statsRoutes);

// Rota de Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MathPlay Solutions API',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// Tratamento Global de Erros
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor MathPlay rodando na porta ${PORT}`);
  console.log(`📡 URL da API: http://localhost:${PORT}/api`);
});
