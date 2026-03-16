const express = require('express');
const router = express.Router();
const { adminLogin, getAdminStats, changePassword, adminLogout, getAdminProfile } = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { adminLoginLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/login', adminLoginLimiter, adminLogin);
router.post('/logout', adminLogout);

// Protected routes (require admin authentication)
router.get('/me', adminAuthMiddleware, getAdminProfile);
router.get('/stats', adminAuthMiddleware, getAdminStats);
router.put('/change-password', adminAuthMiddleware, changePassword);

module.exports = router;
