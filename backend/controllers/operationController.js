const Task = require('../models/Task');
const Event = require('../models/Event');
const Subcommittee = require('../models/Subcommittee');
const AuditLog = require('../models/AuditLog');

// Helper function to log actions
const logAction = async (user, action, target) => {
  try {
    await AuditLog.create({ user: user.name, team: user.team, action, target });
  } catch (error) { console.error("Audit log failed"); }
};

// --- TASKS (Assuming you still have your task functions here) ---
const getTasks = async (req, res) => { res.json(await Task.find().sort({ createdAt: -1 })); };
const createTask = async (req, res) => { res.json(await Task.create(req.body)); };
const updateTask = async (req, res) => { res.json(await Task.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})); };
const deleteTask = async (req, res) => { await Task.findByIdAndDelete(req.params.id); res.json({msg: 'Deleted'}); };

// --- EVENTS (Calendar) ---
const getEvents = async (req, res) => { res.json(await Event.find().sort('date')); };

const createEvent = async (req, res) => { 
  try {
    // If a regular Secretary creates it, it goes to Pending. Execs and Leads are Auto-Approved.
    const isRegularSec = req.user.title === 'Secretary' && req.user.team !== 'Executive';
    const status = isRegularSec ? 'Pending' : 'Approved';

    const newEvent = await Event.create({ ...req.body, status });
    await logAction(req.user, `Scheduled Event (${status})`, newEvent.title);
    res.json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create event.' });
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    await logAction(req.user, `Approved Event`, event.title);
    res.json(event);
  } catch (error) { res.status(400).json({ message: 'Failed to update event' }); }
};

// FIX: Kept only the new deleteEvent with the Audit Logger
const deleteEvent = async (req, res) => { 
  const event = await Event.findByIdAndDelete(req.params.id); 
  if (event) await logAction(req.user, `Terminated Event`, event.title);
  res.json({msg: 'Deleted'}); 
};


// --- SUBCOMMITTEE INFO ---
const getSubInfo = async (req, res) => { 
  let sub = await Subcommittee.findOne({ name: req.params.name });
  if (!sub) sub = await Subcommittee.create({ name: req.params.name }); 
  res.json(sub); 
};
const updateSubInfo = async (req, res) => {
  const sub = await Subcommittee.findOneAndUpdate({ name: req.params.name }, req.body, { returnDocument: 'after', upsert: true });
  res.json(sub);
};

// FIX: Added updateEventStatus to the exports!
module.exports = { 
  getTasks, createTask, updateTask, deleteTask, 
  getEvents, createEvent, updateEventStatus, deleteEvent, 
  getSubInfo, updateSubInfo 
};