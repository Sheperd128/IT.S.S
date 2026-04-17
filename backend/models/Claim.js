const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  subcommittee: { type: String, required: true },
  requestedBy: { type: String, required: true }, 
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  receiptUrl: { type: String },
  reviewerNote: { type: String, default: '' } 
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);