const Settings = require('../models/Settings');

// @desc    Get global settings (creates default if not exists)
// @route   GET /api/settings
// @access  Private (Admin)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        defaultCheckoutTime: '11:00',
        defaultCheckInTime: '12:00',
        hotelContactNumber: ''
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    const { defaultCheckoutTime, defaultCheckInTime, hotelContactNumber } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        defaultCheckoutTime: defaultCheckoutTime || '11:00',
        defaultCheckInTime: defaultCheckInTime || '12:00',
        hotelContactNumber: hotelContactNumber || ''
      });
    } else {
      settings.defaultCheckoutTime = defaultCheckoutTime || settings.defaultCheckoutTime;
      settings.defaultCheckInTime = defaultCheckInTime || settings.defaultCheckInTime;
      settings.hotelContactNumber = hotelContactNumber !== undefined ? hotelContactNumber : settings.hotelContactNumber;
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
