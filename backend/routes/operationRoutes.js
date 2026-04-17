const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, getEvents, createEvent, deleteEvent, getSubInfo, updateSubInfo } = require('../controllers/operationController');
const { protect, leadOrExec } = require('../middleware/authMiddleware');

// Tasks
router.route('/tasks').get(protect, getTasks).post(protect, leadOrExec, createTask);
router.route('/tasks/:id').put(protect, leadOrExec, updateTask).delete(protect, leadOrExec, deleteTask);

// Events
router.route('/events').get(getEvents).post(protect, leadOrExec, createEvent);
router.route('/events/:id').delete(protect, leadOrExec, deleteEvent);

// Subcommittee 
router.route('/subcommittee/:name').get(getSubInfo).put(protect, leadOrExec, updateSubInfo);

module.exports = router;