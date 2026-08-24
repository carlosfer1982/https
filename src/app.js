require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

// 1. Inicializa o aplicativo Express primeiro
const app = express();

// 2. Importa as rotas
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// 3. Middlewares Globais de Segurança e Parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Configuração da Sessão (deve vir ANTES das rotas)
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Mude para true se utilizar HTTPS
}));

// 5. Definição das Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rota raiz de teste
app.get('/', (req, res) => {
  res.send('API CRUD Node.js ativa!');
});

module.exports = app;