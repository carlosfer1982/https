require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

const productRoutes = require('./routes/productRoutes');

const app = express();

// Middlewares de Segurança e Utilitários
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de Sessão (opcional dependendo de como usará a autenticação)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Altere para true em produção com HTTPS
}));

// Rotas da API
app.use('/api/products', productRoutes);

// Rota raiz de verificação
app.get('/', (req, res) => {
  res.send('API CRUD Node.js ativa!');
});

module.exports = app;