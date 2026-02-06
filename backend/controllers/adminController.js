const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getAdminStats = async (req, res, next) => {
  try {
    const Room = require('../models/Room');

    // Get total rooms count
    const totalRooms = await Room.countDocuments();

    // Null-safety: If no rooms exist, return zeros
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

    // Get room status breakdown
    const availableCount = await Room.countDocuments({ status: 'Available' });
    const bookedCount = await Room.countDocuments({ status: 'Booked' });
    const maintenanceCount = await Room.countDocuments({ status: 'Maintenance' });

    // Calculate occupancy rate
    const occupancyRate = totalRooms > 0 
      ? Math.round((bookedCount / totalRooms) * 100) 
      : 0;

    // Calculate total revenue from booked rooms
    const bookedRooms = await Room.find({ status: 'Booked' });
    const totalRevenue = bookedRooms.reduce((sum, room) => sum + room.price, 0);

    // Get all rooms for recent bookings (showing booked rooms)
    const recentBookedRooms = await Room.find({ status: 'Booked' })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Format recent bookings
    const recentBookings = recentBookedRooms.map(room => ({
      id: room._id,
      guestName: 'Guest', // Placeholder - will be replaced when booking system is implemented
      room: `${room.type} - Room ${room.roomNumber}`,
      checkIn: room.updatedAt.toISOString().split('T')[0],
      status: 'confirmed',
      price: room.price,
      priceINR: `₹${room.price.toLocaleString('en-IN')}`
    }));

    // Weekly revenue (placeholder - will be calculated from actual bookings later)
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
      pendingOrders: 0, // Placeholder - will be from orders system
      reservations: bookedCount,
      weeklyRevenue,
      recentBookings
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
};
