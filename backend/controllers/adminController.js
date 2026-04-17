const User = require('../models/User');
const SiteContent = require('../models/SiteContent');
const bcrypt = require('bcryptjs');

// 1. DELETE USER
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User terminated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// 2. FORCE RESET PASSWORD
const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// 3. GET SITE CONTENT
const getSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({ contentId: 'homepage' });
    if (!content) content = await SiteContent.create({}); 
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load site content' });
  }
};

// 4. UPDATE SITE CONTENT
const updateSiteContent = async (req, res) => {
  try {
    const content = await SiteContent.findOneAndUpdate(
      { contentId: 'homepage' }, 
      req.body, 
      { returnDocument: 'after', upsert: true } // <-- Changed from new: true
    );
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update site content' });
  }
};

// 5. UPDATE USER PROFILE (Bio, Pic, Name, Title)
const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, profilePic, title, team } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, profilePic, title, team },
      { returnDocument: 'after' } // <-- Changed from new: true
    ).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

module.exports = { deleteUser, resetUserPassword, getSiteContent, updateSiteContent, updateUserProfile };