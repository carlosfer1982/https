const User = require('../models/User');

// Registro de Usuário
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Usuário já existe' });
    }

    const user = await User.create({ username, password });
    return res.status(201).json({ success: true, message: 'Usuário criado com sucesso' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login usando Express-Session
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }

    // Salva o usuário na sessão do Express
    req.session.user = { id: user._id, username: user.username };

    return res.status(200).json({
      success: true,
      message: 'Login efetuado com sucesso',
      user: req.session.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao fazer logout' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: 'Logout efetuado com sucesso' });
  });
};