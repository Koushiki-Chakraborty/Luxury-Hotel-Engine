const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include both letters and numbers.'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HttpOnly cookie
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
    };

    user.password = undefined;

    res.status(200).cookie('admin_auth', token, options).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.adminLogout = async (req, res, next) => {
  res.cookie('admin_auth', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

exports.getAdminProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const Room = require('../models/Room');

    const totalRooms = await Room.countDocuments();

    if (totalRooms === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalRooms: 0,
          revenue: {
            total: 0,
            totalINR: '₹0'
          },
          occupancy: {
            rate: 0,
            total: 0,
            occupied: 0,
            available: 0,
            maintenance: 0
          },
          roomStatusBreakdown: {
            Available: 0,
            Booked: 0,
            Maintenance: 0
          },
          pendingOrders: 0,
          reservations: 0,
          weeklyRevenue: [
            { day: 'Mon', revenue: 0 },
            { day: 'Tue', revenue: 0 },
            { day: 'Wed', revenue: 0 },
            { day: 'Thu', revenue: 0 },
            { day: 'Fri', revenue: 0 },
            { day: 'Sat', revenue: 0 },
            { day: 'Sun', revenue: 0 }
          ],
          recentBookings: []
        }
      });
    }

    const availableCount = await Room.countDocuments({ status: 'Available' });
    const bookedCount = await Room.countDocuments({ status: 'Booked' });
    const maintenanceCount = await Room.countDocuments({ status: 'Maintenance' });

    const occupancyRate = totalRooms > 0
      ? Math.round((bookedCount / totalRooms) * 100)
      : 0;

    const revenueAgg = await Room.aggregate([
      { $match: { status: 'Booked' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    const recentBookedRooms = await Room.find({ status: 'Booked' })
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentBookings = recentBookedRooms.map(room => ({
      id: room._id,
      guestName: 'Guest',
      room: `${room.type} - Room ${room.roomNumber}`,
      checkIn: room.updatedAt.toISOString().split('T')[0],
      status: 'confirmed',
      price: room.price,
      priceINR: `₹${room.price.toLocaleString('en-IN')}`
    }));

    const weeklyRevenue = [
      { day: 'Mon', revenue: 0 },
      { day: 'Tue', revenue: 0 },
      { day: 'Wed', revenue: 0 },
      { day: 'Thu', revenue: 0 },
      { day: 'Fri', revenue: 0 },
      { day: 'Sat', revenue: 0 },
      { day: 'Sun', revenue: 0 }
    ];

    const stats = {
      totalRooms,
      revenue: {
        total: totalRevenue,
        totalINR: `₹${totalRevenue.toLocaleString('en-IN')}`
      },
      occupancy: {
        rate: occupancyRate,
        total: totalRooms,
        occupied: bookedCount,
        available: availableCount,
        maintenance: maintenanceCount
      },
      roomStatusBreakdown: {
        Available: availableCount,
        Booked: bookedCount,
        Maintenance: maintenanceCount
      },
      pendingOrders: 0,
      reservations: bookedCount,
      weeklyRevenue,
      recentBookings
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include both letters and numbers.'
      });
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
