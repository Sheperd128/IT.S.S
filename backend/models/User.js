const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|vossie\.net)$/, 
      'Email must be a valid @gmail.com or @vossie.net address'
    ]
  },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  
  team: {
    type: String,
    enum: ['Executive', 'Academics', 'Wellness', 'Events', 'Research', 'General'],
    required: true,
  },
  
  // UPDATED: Proper hierarchy titles
  title: {
    type: String,
    enum: ['President', 'Vice President', 'Treasurer', 'Secretary', 'Lead', 'Deputy Lead', 'Member'],
    required: true,
  },
  
  bio: { type: String, default: 'Passionate about technology and building the ITSS community.' },
  profilePic: { type: String, default: 'https://via.placeholder.com/400x400.png?text=NO+IMAGE' },
  isApproved: { type: Boolean, default: false }, // VP approves General Members

  stats: {
    loginCount: { type: Number, default: 0 },
    points: { type: Number, default: 0 }, 
    joinDate: { type: Date, default: Date.now },
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);