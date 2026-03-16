const express = require('express');
const router = express.Router();
const {
  createLog,
  getAllLogs,
  deleteLog,
  getLogStats,
  updateLog,
  checkoutLog,
  getDueCheckouts,
  resetMonth
} = require('../controllers/logController');

// @route   POST /api/logs
// @desc    Create a new log entry
// @access  Private (Admin)
router.post('/', createLog);

// @route   GET /api/logs
// @desc    Get all log entries (sorted by date descending)
// @access  Private (Admin)
router.get('/', getAllLogs);

// @route   GET /api/logs/stats
// @desc    Get aggregated stats (revenue by date)
// @access  Private (Admin)
router.get('/stats', getLogStats);

// @route   GET /api/logs/checkouts/due
// @desc    Get logs due for checkout today
// @access  Private (Admin)
router.get('/checkouts/due', getDueCheckouts);

// @route   PUT /api/logs/:id
// @desc    Update a log entry
// @access  Private (Admin)
router.put('/:id', updateLog); // Used updateLog directly as per existing pattern

// @route   PUT /api/logs/:id/checkout
// @desc    Check-out a room log
// @access  Private (Admin)
router.put('/:id/checkout', checkoutLog);

// @route   DELETE /api/logs/:id
// @desc    Delete a log entry
// @access  Private (Admin)
router.delete('/:id', deleteLog); // Kept deleteLog directly as per existing pattern

// @route   DELETE /api/logs/reset-month
// @desc    Archive/Reset Month (Delete all except Active Rooms)
// @access  Private (Admin)
router.delete('/reset-month', resetMonth);

module.exports = router;
