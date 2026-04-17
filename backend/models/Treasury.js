const mongoose = require('mongoose');

const treasurySchema = new mongoose.Schema({
  settingsId: { type: String, default: 'main_budget' }, // Ensures we only ever have ONE budget document
  totalBudget: { type: Number, default: 0 }
});

module.exports = mongoose.model('Treasury', treasurySchema);