const Restaurant = require('../models/Restaurant');
const cloudinary = require('../config/cloudinary');

// @desc    Get restaurant data
// @route   GET /api/restaurant
// @access  Public
exports.getRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();
    
    // If no restaurant exists, create one
    if (!restaurant) {
      restaurant = await Restaurant.create({ images: [] });
    }
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant data',
      error: error.message
    });
  }
};

// @desc    Update restaurant images
// @route   PUT /api/restaurant
// @access  Private/Admin
exports.updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
      restaurant = await Restaurant.create({ images: [] });
    }

    // Handle file uploads
    const uploadedImages = [];
    
    if (req.files && req.files.length > 0) {
      // Upload each file to Cloudinary
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'rudraksh-inn/restaurant',
          resource_type: 'auto'
        });
        uploadedImages.push(result.secure_url);
      }
    }

    // Parse existing images from FormData (comes as JSON string)
    // This ensures empty arrays [] actually clear the gallery
    const existingImages = req.body.existingImages 
      ? JSON.parse(req.body.existingImages) 
      : [];
    
    // Merge existing images with newly uploaded ones
    const allImages = [...existingImages, ...uploadedImages];

    restaurant.images = allImages;
    await restaurant.save();

    res.status(200).json({
      success: true,
      data: restaurant,
      message: 'Restaurant updated successfully'
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update restaurant',
      error: error.message
    });
  }
};
