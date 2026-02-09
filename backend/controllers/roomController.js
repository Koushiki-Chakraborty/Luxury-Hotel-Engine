const Room = require('../models/Room');
const cloudinary = require('../config/cloudinary');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private (Admin only)
exports.createRoom = async (req, res, next) => {
  try {
    const { roomNumber, type, price, originalPrice, amenities, description, images, status } = req.body;

    // Validate required fields
    if (!roomNumber || !type || price === undefined || originalPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: roomNumber, type, price, originalPrice'
      });
    }

    // Parse prices to numbers (FormData sends them as strings)
    const priceNum = Number(price);
    const originalPriceNum = Number(originalPrice);

    // Validate price <= originalPrice
    if (!isNaN(priceNum) && !isNaN(originalPriceNum) && priceNum > originalPriceNum) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be greater than original price'
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
      originalPrice: originalPriceNum,
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
    const { price, originalPrice, roomNumber } = req.body;

    // Find room
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Process images
    // Frontend sends:
    // - existingImages: JSON array of URLs to keep
    // - images (via req.files): new File objects to upload
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
    // Logic: Existing Room Images NOT in the new imageUrls array should be deleted
    // Note: imageUrls contains the FINAL state of desired images (both kept existing + new ones)
    const imagesToDelete = room.images.filter(imgUrl => !imageUrls.includes(imgUrl));

    if (imagesToDelete.length > 0) {
        imagesToDelete.forEach(async (imageUrl) => {
            try {
                // Extract public_id from URL
                // Example: https://res.cloudinary.com/cloudname/image/upload/v1234/folder/filename.jpg
                // Public ID: folder/filename (without extension)
                const parts = imageUrl.split('/');
                const filename = parts[parts.length - 1];
                const publicIdWithExt = filename.split('.')[0];
                const folder = parts[parts.length - 2];
                // Assuming folder structure is simple, usually it's best to store public_id in DB, but extracting works for standard setups
                // Better approach: regex to get everything after 'upload/v<version>/' and before extension

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
    let priceNum, originalPriceNum;
    if (price !== undefined) priceNum = Number(price);
    if (originalPrice !== undefined) originalPriceNum = Number(originalPrice);

    // Validate price <= originalPrice if both are provided
    if (priceNum !== undefined && originalPriceNum !== undefined) {
      if (priceNum > originalPriceNum) {
        return res.status(400).json({
          success: false,
          message: 'Price cannot be greater than original price'
        });
      }
    }

    // If only price is being updated, check against existing originalPrice
    if (priceNum !== undefined && originalPriceNum === undefined && priceNum > room.originalPrice) {
      return res.status(400).json({
        success: false,
        message: `Price (₹${priceNum}) cannot be greater than original price (₹${room.originalPrice})`
      });
    }

    // If only originalPrice is being updated, check against existing price
    if (originalPriceNum !== undefined && priceNum === undefined && room.price > originalPriceNum) {
      return res.status(400).json({
        success: false,
        message: `Original price (₹${originalPriceNum}) cannot be less than current price (₹${room.price})`
      });
    }

    // Construct update object
    const updateData = { ...req.body };
    if (priceNum !== undefined) updateData.price = priceNum;
    if (originalPriceNum !== undefined) updateData.originalPrice = originalPriceNum;
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
