const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Função simples para interceptar os erros de validação
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Rota de Registro
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('O usuário deve ter pelo menos 3 caracteres'),
  body('password').isLength({ min: 4 }).withMessage('A senha deve ter no mínimo 4 caracteres'),
  checkValidation
], authController.register);

// Rota de Login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Informe o usuário'),
  body('password').notEmpty().withMessage('Informe a senha'),
  checkValidation
], authController.login);

// Rota de Logout
router.post('/logout', authController.logout);

// Exemplo de rota protegida por sessão
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({ success: true, user: req.session.user });
});

module.exports = router;