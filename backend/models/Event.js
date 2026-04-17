const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, default: 'TBA' },
  organizingSubcommittee: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved'], default: 'Approved' } 
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);