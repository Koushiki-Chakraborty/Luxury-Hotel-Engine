const express = require('express');
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Protected routes (admin only)
router.post('/', adminAuthMiddleware, upload.array('images', 5), createRoom);
router.put('/:id', adminAuthMiddleware, upload.array('images', 5), updateRoom);
router.delete('/:id', adminAuthMiddleware, deleteRoom);

module.exports = router;
