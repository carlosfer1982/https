const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);