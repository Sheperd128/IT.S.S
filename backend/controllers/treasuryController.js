const Claim = require('../models/Claim');
const Treasury = require('../models/Treasury');

// --- CLAIMS LOGIC ---
const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch claims' }); }
};

const createClaim = async (req, res) => {
  try {
    const newClaim = await Claim.create({
      ...req.body,
      requestedBy: req.user.name,
      subcommittee: req.user.team
    });
    res.json(newClaim);
  } catch (error) { res.status(400).json({ message: 'Failed to submit claim' }); }
};

const updateClaimStatus = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status, reviewerNote: req.body.reviewerNote }, 
      { returnDocument: 'after' }
    );
    res.json(claim);
  } catch (error) { res.status(400).json({ message: 'Failed to update claim' }); }
};

// --- GLOBAL BUDGET LOGIC ---
const getBudget = async (req, res) => {
  try {
    let t = await Treasury.findOne({ settingsId: 'main_budget' });
    if (!t) t = await Treasury.create({}); // Start at 0 if it doesn't exist
    
    // Calculate the approved claims so the frontend doesn't have to
    const claims = await Claim.find({ status: 'Approved' });
    const approvedTotal = claims.reduce((acc, curr) => acc + curr.amount, 0);
    const availableBalance = t.totalBudget - approvedTotal;

    res.json({ totalBudget: t.totalBudget, availableBalance });
  } catch (error) { 
    res.status(500).json({ message: 'Failed to fetch budget' }); 
  }
};

const adjustBudget = async (req, res) => {
  try {
    let t = await Treasury.findOne({ settingsId: 'main_budget' });
    if (!t) t = await Treasury.create({});
    
    // req.body.amount can be positive (add) or negative (decrease)
    t.totalBudget += Number(req.body.amount);
    await t.save();
    
    res.json(t);
  } catch (error) { res.status(400).json({ message: 'Failed to adjust budget' }); }
};

module.exports = { getClaims, createClaim, updateClaimStatus, getBudget, adjustBudget };