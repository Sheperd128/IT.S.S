const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Meeting Minutes', 'Financial', 'Official Policy', 'Template', 'Comms'], 
    required: true 
  },
  fileUrl: { type: String }, // For uploaded PDFs
  textContent: { type: String }, // For raw text like WhatsApp templates
  uploadedBy: { type: String, required: true },
  uploaderTeam: { type: String, required: true },
  
  // Security Access
  visibility: { 
    type: String, 
    enum: ['Public', 'ExecOnly', 'SubcommitteeOnly'], 
    default: 'Public' 
  },
  targetSubcommittee: { type: String, default: 'All' } // If SubcommitteeOnly, which one?
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);