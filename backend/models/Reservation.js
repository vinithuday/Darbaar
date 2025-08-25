const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  phone:  { type: String, required: true, trim: true },
  date:   { type: String, required: true, trim: true }, 
  time:   { type: String, required: true, trim: true }, 
  guests: { type: Number, required: true, min: 1 },
  notes:  { type: String, default: '', trim: true },
  status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
