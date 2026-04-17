const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roster' });
  }
};

const getPublicTeam = async (req, res) => {
  try {
    const team = await User.find({ team: { $ne: 'General' } })
                           .select('name team title bio profilePic');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch public team' });
  }
};

// NEW: Update user points when they win a game
const updatePoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.stats.points += req.body.points;
      await user.save();
      res.json({ points: user.stats.points });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update points' });
  }
};

// NEW: Get the top 10 players for the Arcade
const getLeaderboard = async (req, res) => {
  try {
    // Exclude Super Admins from the leaderboard to keep it fair for students
    const topUsers = await User.find({ title: { $ne: 'President' } })
                               .sort({ 'stats.points': -1 })
                               .limit(10)
                               .select('name stats.points profilePic team');
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

module.exports = { getUsers, getPublicTeam, updatePoints, getLeaderboard };