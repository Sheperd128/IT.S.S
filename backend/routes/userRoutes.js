const express = require('express');
const router = express.Router();
const { getUsers, getPublicTeam, updatePoints, getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/public-team', getPublicTeam); 
router.get('/leaderboard', getLeaderboard); // PUBLIC or PROTECTED, up to you.
router.put('/points', protect, updatePoints); // PROTECTED: Only logged-in users can earn points
router.get('/', protect, getUsers);        

module.exports = router;