require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path'); // 1. Módulo nativo do Node.js
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meu_crud_db';

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Carregamento de Rotas
app.use('/api', routes);

// 2. Liberar o Express para servir os arquivos HTML/CSS da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));


// Conexão com MongoDB e inicialização do servidor
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro de conexão no MongoDB:', err.message);
  });