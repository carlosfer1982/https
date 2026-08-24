const Joi = require('joi');

// Esquema para registro de novo usuário
const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'O login/usuário não pode estar vazio.',
    'string.min': 'O login deve ter pelo menos 3 caracteres.',
    'any.required': 'O login é obrigatório.'
  }),
  password: Joi.string().min(4).required().messages({
    'string.empty': 'A senha não pode estar vazia.',
    'string.min': 'A senha deve ter no mínimo 4 caracteres.',
    'any.required': 'A senha é obrigatória.'
  })
});

// Esquema para autenticação (Login)
const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.empty': 'Informe o seu login/usuário.',
    'any.required': 'O login é obrigatório.'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Informe a sua senha.',
    'any.required': 'A senha é obrigatória.'
  })
});

module.exports = {
  registerSchema,
  loginSchema
};