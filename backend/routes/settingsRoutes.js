const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// All settings routes are protected
router.use(adminAuthMiddleware);

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
