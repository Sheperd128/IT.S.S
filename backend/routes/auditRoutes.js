const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, presOrVice } = require('../middleware/authMiddleware');

// @route   GET /api/audit
// @desc    Get all system audit logs
// @access  Private (President & VP Only)
router.get('/', protect, presOrVice, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system audit logs' });
  }
});

module.exports = router;