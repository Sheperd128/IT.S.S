const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  contentId: { type: String, default: 'homepage' },
  heroWord1: { type: String, default: 'UNITE.' },
  heroWord2: { type: String, default: 'BUILD.' },
  heroWord3: { type: String, default: 'INNOVATE.' },
  heroSubtitle: { type: String, default: 'Building an inclusive, innovative, and empowering community for all students within the IT faculty. No coder left behind.' },
  announcementBadge: { type: String, default: 'SYSTEM ONLINE' },
  
  themeConfig: {
    preset: { type: String, default: 'Default' },
    colors: {
      primary: { type: String, default: '#9DCD5A' }, // Lime Green
      secondary: { type: String, default: '#b388ff' }, // Purple
      success: { type: String, default: '#00e676' },   // Green
      warning: { type: String, default: '#ffea00' },   // Yellow
      danger: { type: String, default: '#ff1744' },    // Red
      orange: { type: String, default: '#ff9100' }     // Orange
    }
  }
});

module.exports = mongoose.model('SiteContent', siteContentSchema);