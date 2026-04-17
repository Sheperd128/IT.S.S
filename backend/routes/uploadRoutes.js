const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure where and how the files are saved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Saves to the 'uploads' folder in your backend
  },
  filename(req, file, cb) {
    // Creates a unique filename: e.g., document-1623456789.png
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Security: Allow documents AND images
const checkFileType = (file, cb) => {
  // THE FIX: Added jpg, jpeg, png, and gif to the allowed list!
  const filetypes = /pdf|zip|txt|doc|docx|jpg|jpeg|png|gif/;
  
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type (includes standard mime types plus the complex Microsoft Word one)
  const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('REJECTED: Only images (.jpg, .png, .gif) and documents (.pdf, .zip, .txt, .doc, .docx) are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// The POST route that the frontend will hit
router.post('/', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or file type rejected.' });
  }
  // Return the file path so the frontend can save it to the database
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;