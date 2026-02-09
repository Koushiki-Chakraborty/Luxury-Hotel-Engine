const Room = require('../models/Room');
const cloudinary = require('../config/cloudinary');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private (Admin only)
exports.createRoom = async (req, res, next) => {
  try {
    const { roomNumber, type, price, amenities, description, images, status } = req.body;

    // Validate required fields
    if (!roomNumber || !type || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: roomNumber, type, price'
      });
    }

    // Parse prices to numbers (FormData sends them as strings)
    const priceNum = Number(price);

    // Validate price
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid price'
      });
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room ${roomNumber} already exists`
      });
    }

    // Process uploaded images
    let imageUrls = req.body.images || [];
    if (typeof imageUrls === 'string') imageUrls = [imageUrls]; // Handle single image string case

    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map(file => file.path);
      imageUrls = [...imageUrls, ...uploadedUrls];
    }

    // Create room
    const room = await Room.create({
      roomNumber,
      type,
      price: priceNum,
      amenities: amenities || [],
      description,
      images: imageUrls,
      status: status || 'Available'
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating room'
    });
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getAllRooms = async (req, res, next) => {
  try {
    const { type, status, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch rooms
    const rooms = await Room.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Room.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: rooms
    });
  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching rooms'
    });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Get room by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error fetching room'
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin only)
exports.updateRoom = async (req, res, next) => {
  try {
    const { price, roomNumber } = req.body;

    // Find room
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Process images
    let imageUrls = [];
    
    // Parse existing images from frontend
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        if (Array.isArray(existingImages)) {
          imageUrls = existingImages;
        }
      } catch (err) {
        console.error('Error parsing existingImages:', err);
      }
    }

    // Add new uploaded images from Cloudinary
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    // Identify images to delete from Cloudinary
    const imagesToDelete = room.images.filter(imgUrl => !imageUrls.includes(imgUrl));

    if (imagesToDelete.length > 0) {
        imagesToDelete.forEach(async (imageUrl) => {
            try {
                const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
                const match = imageUrl.match(regex);
                
                if (match && match[1]) {
                     const publicId = match[1];
                     await cloudinary.uploader.destroy(publicId);
                }
            } catch (err) {
                console.error('Error deleting image from Cloudinary:', err);
            }
        });
    }

    // Check for duplicate room number (excluding current room)
    if (roomNumber && roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({ 
        roomNumber, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingRoom) {
        return res.status(400).json({
          success: false,
          message: `Room number ${roomNumber} already exists`
        });
      }
    }

    // Parse prices if provided
    let priceNum;
    if (price !== undefined) priceNum = Number(price);

    // Construct update object
    const updateData = { ...req.body };
    if (priceNum !== undefined) updateData.price = priceNum;
    updateData.images = imageUrls;

    // Update room
    room = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    console.error('Update room error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating room'
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin only)
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Delete images from Cloudinary
    if (room.images && room.images.length > 0) {
      for (const imageUrl of room.images) {
        // Extract public ID: rudra-inn/rooms/filename
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        const publicId = `rudra-inn/rooms/${filename}`;
        
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(`Failed to delete image ${publicId} from Cloudinary:`, err);
        }
      }
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Room ${room.roomNumber} deleted successfully`
    });
  } catch (error) {
    console.error('Delete room error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error deleting room'
    });
  }
};
