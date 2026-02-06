const express = require('express');
const router = express.Router();
const { adminLogin, getAdminStats } = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// Public routes
router.post('/login', adminLogin);

// Protected routes (require admin authentication)
router.get('/stats', adminAuthMiddleware, getAdminStats);

module.exports = router;
