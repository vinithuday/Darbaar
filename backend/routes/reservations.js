const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Missing required fields: name, phone' });
    }

    const reservation = await Reservation.create(req.body);

    res.status(201).json({
      message: 'Reservation created',
      reservation
    });
  } catch (err) {
    console.error('Create reservation error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});


router.get('/', async (_req, res) => {
  try {
    const items = await Reservation.find().sort({ createdAt: -1 });
    res.json({ reservations: items });
  } catch (err) {
    console.error('List reservations error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Reservation updated', reservation: updated });
  } catch (err) {
    console.error('Update reservation error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    console.error('Delete reservation error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

module.exports = router;
