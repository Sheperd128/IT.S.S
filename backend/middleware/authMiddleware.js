const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Executive Team Only (President, VP, Exec Treasurer, Exec Secretary)
const execOnly = (req, res, next) => {
  if (req.user && req.user.team === 'Executive') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Executive clearance required.' });
  }
};

// Sub-Committee Leads or Executives
const leadOrExec = (req, res, next) => {
  const isExec = req.user.team === 'Executive';
  const isLead = req.user.title === 'Lead' || req.user.title === 'Deputy Lead';
  
  if (req.user && (isExec || isLead)) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Leadership clearance required.' });
  }
};

// Strict President or Vice President Only
const presOrVice = (req, res, next) => {
  if (req.user && req.user.team === 'Executive' && (req.user.title === 'President' || req.user.title === 'Vice President')) {
    next();
  } else {
    res.status(403).json({ message: 'ACCESS DENIED: President or Vice President clearance required.' });
  }
};

module.exports = { protect, execOnly, leadOrExec, presOrVice }; // Update your exports!