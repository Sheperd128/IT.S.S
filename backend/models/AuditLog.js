const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: { type: String, required: true },
  team: { type: String, required: true },
  action: { type: String, required: true }, // e.g., "Created Event", "Updated Subcommittee"
  target: { type: String, required: true }  // e.g., "Hackathon 2026", "Academics Page"
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditSchema);