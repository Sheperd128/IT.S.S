const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagline: { type: String, default: 'Building the future of IT.' },
  mission: { type: String, default: 'Our mission is to support students.' },
  initiatives: { type: [String], default: ['Initiative 1', 'Initiative 2', 'Initiative 3', 'Initiative 4'] },
  
  announcements: [{ title: String, text: String }], // "Student of the Month", etc.
  resources: [{ title: String, url: String }], // For Academics/Research
  gallery: [{ url: String, caption: String }] // For Events
});

module.exports = mongoose.model('Subcommittee', subSchema);