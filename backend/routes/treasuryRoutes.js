const express = require('express');
const router = express.Router();
const { getClaims, createClaim, updateClaimStatus, getBudget, adjustBudget } = require('../controllers/treasuryController');
const { protect, leadOrExec } = require('../middleware/authMiddleware');

const treasuryOrPres = (req, res, next) => {
  if (req.user && req.user.team === 'Executive' && ['President', 'Vice President', 'Treasurer'].includes(req.user.title)) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Treasury clearance required.' });
  }
};

// Claims
router.route('/').get(protect, leadOrExec, getClaims).post(protect, leadOrExec, createClaim);
router.route('/:id/status').put(protect, treasuryOrPres, updateClaimStatus);
router.route('/budget').get(protect, getBudget).put(protect, treasuryOrPres, adjustBudget);

// Budget
router.route('/budget').get(protect, leadOrExec, getBudget).put(protect, treasuryOrPres, adjustBudget);

module.exports = router;