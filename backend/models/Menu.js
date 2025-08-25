const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  veg: { type: Boolean, default: false },
  imageUrl: { type: String, default: '' },
  description: { type: String, required: true, trim: true },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model('Menu', MenuSchema, 'menu');
