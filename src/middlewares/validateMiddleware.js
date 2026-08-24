const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Formata os erros para retornar mensagens limpas
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ success: false, errors });
    }

    next();
  };
};

module.exports = validate;