const express = require('express');
const router = express.Router();
const { getDocuments, createDocument, deleteDocument } = require('../controllers/documentController');
const { protect, leadOrExec } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDocuments).post(protect, leadOrExec, createDocument);
router.route('/:id').delete(protect, leadOrExec, deleteDocument);

module.exports = router;