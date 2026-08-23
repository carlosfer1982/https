const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

// Conecta ao banco de dados e inicia o servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});