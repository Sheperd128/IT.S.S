const express = require('express');
const router = express.Router();

// Import your existing controllers
const { 
  deleteUser, 
  resetUserPassword, 
  getSiteContent, 
  updateSiteContent, 
  updateUserProfile 
} = require('../controllers/adminController'); 

const { protect, presOrVice } = require('../middleware/authMiddleware');

// --- SITE CONTENT ---
router.route('/content')
  .get(getSiteContent)
  .put(protect, presOrVice, updateSiteContent);

// --- USER MANAGEMENT ---
// THE FIX: This maps the PUT request so the 404 error disappears!
router.route('/users/:id')
  .put(protect, updateUserProfile)
  .delete(protect, presOrVice, deleteUser);

// Password Reset
router.route('/users/:id/reset')
  .put(protect, presOrVice, resetUserPassword);

module.exports = router;