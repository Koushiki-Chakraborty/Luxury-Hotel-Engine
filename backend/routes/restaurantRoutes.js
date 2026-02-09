const express = require('express');
const router = express.Router();
const { getRestaurant, updateRestaurant } = require('../controllers/restaurantController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route
router.get('/', getRestaurant);

// Admin only route
router.put('/', adminAuthMiddleware, upload.array('images', 20), updateRestaurant);

module.exports = router;
