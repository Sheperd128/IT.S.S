const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedSubcommittee: { type: String, enum: ['Academics', 'Wellness', 'Events', 'Research', 'Executive'], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The specific person
  dueDate: { type: Date },
  status: { type: String, enum: ['Pending', 'In Progress', 'Awaiting Approval', 'Completed'], default: 'Pending' },
  needsExecHelp: { type: Boolean, default: false } // This is the "flagging" system she asked for
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);