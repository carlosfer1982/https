const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Product } = require('./models');

const SECRET = process.env.JWT_SECRET || 'chave_secreta_padrao';

// Middleware de Autenticação (verifica se o cookie do token existe e é válido)
const auth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Acesso negado. Faça login.' });
  }

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Sessão inválida ou expirada.' });
  }
};

// --- ROTAS DE AUTENTICAÇÃO ---

// Registro de Usuário
router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, message: 'A senha deve ter no mínimo 4 caracteres' });
    }
    
    await User.create({ username, password });
    res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true })
       .json({ success: true, message: 'Login realizado com sucesso', username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Logout
router.post('/auth/logout', (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logout efetuado' });
});

// --- ROTAS DO CRUD DE PRODUTOS (Protegidas com o middleware 'auth') ---

// Criar produto
router.post('/products', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Listar todos os produtos
router.get('/products', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Atualizar produto por ID
router.put('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Deletar produto por ID
router.delete('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    res.json({ success: true, message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;