const Log = require('../models/Log');
const Room = require('../models/Room');

// Create a new log entry
exports.createLog = async (req, res) => {
  try {
    const { date, source, category, description, units, duration, unitPrice, roomNumber, customerName } = req.body;

    // Validate based on category
    if (category === 'Room') {
      if (!roomNumber || !customerName) {
        return res.status(400).json({
          success: false,
          message: 'Room Number and Customer Name are required for Room logs'
        });
      }
    }

    // Calculate checkout date (date + duration days)
    const logDate = date ? new Date(date) : new Date();
    const checkoutDate = new Date(logDate);
    checkoutDate.setDate(checkoutDate.getDate() + (Number(duration) || 1));

    const log = new Log({
      date: logDate,
      source,
      category,
      description,
      roomNumber,
      customerName,
      checkoutDate,
      units: units || 1,
      duration: duration || 1,
      unitPrice,
      status: 'Active'
    });

    await log.save();

    // AUTO-BOOK ROOM LOGIC
    if (category === 'Room' && roomNumber) {
      const room = await Room.findOne({ roomNumber });
      if (room) {
        room.status = 'Booked';
        await room.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Log entry created successfully',
      data: log
    });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update a log entry
// @route   PUT /api/logs/:id
// @access  Private (Admin)
exports.updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      date, 
      source, 
      category, 
      description, 
      units, 
      duration, 
      unitPrice,
      roomNumber,
      customerName
    } = req.body;

    let log = await Log.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log entry not found'
      });
    }

    // 1. Handle Room Change Logic
    if (log.category === 'Room') {
      // If room number is changing
      if (roomNumber && log.roomNumber !== roomNumber) {
        // A. Release old room
        if (log.roomNumber) {
          const oldRoom = await Room.findOne({ roomNumber: log.roomNumber });
          if (oldRoom) {
            oldRoom.status = 'Available';
            await oldRoom.save();
          }
        }
        
        // B. Book new room
        const newRoom = await Room.findOne({ roomNumber });
        if (newRoom) {
          newRoom.status = 'Booked';
          await newRoom.save();
        }
      }
    }

    // 2. Recalculate Fields
    // If duration changed, update checkout date
    let checkoutDate = log.checkoutDate;
    if (date || duration) {
       const newDate = date ? new Date(date) : log.date;
       const newDuration = duration ? Number(duration) : log.duration;
       checkoutDate = new Date(newDate);
       checkoutDate.setDate(checkoutDate.getDate() + newDuration);
    }

    // 3. Update Log Fields
    log.date = date || log.date;
    log.source = source || log.source;
    log.category = category || log.category;
    log.description = description !== undefined ? description : log.description;
    log.units = units || log.units;
    log.duration = duration || log.duration;
    log.unitPrice = unitPrice || log.unitPrice;
    log.roomNumber = roomNumber !== undefined ? roomNumber : log.roomNumber;
    log.customerName = customerName !== undefined ? customerName : log.customerName;
    log.checkoutDate = checkoutDate;

    // Save triggers pre-save hook which recalculates totalAmount
    await log.save();

    res.status(200).json({
      success: true,
      data: log
    });

  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all log entries (sorted by date descending)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching log entries',
      error: error.message
    });
  }
};

// Delete a log entry
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await Log.findByIdAndDelete(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Log entry deleted successfully',
      data: log
    });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting log entry',
      error: error.message
    });
  }
};

// Get aggregated stats (revenue by date)
exports.getLogStats = async (req, res) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$date" } 
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          count: 1
        }
      }
    ]);

    // Calculate total revenue
    const totalRevenue = stats.reduce((sum, day) => sum + day.revenue, 0);

    res.status(200).json({
      success: true,
      totalRevenue,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching log statistics',
      error: error.message
    });
  }
};
// Check-out a room
exports.checkoutLog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the log
    const log = await Log.findById(id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Log not found' });
    }

    if (log.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Log is already completed' });
    }

    // Update Log status
    log.status = 'Completed';
    await log.save();

    // Release the Room
    if (log.category === 'Room' && log.roomNumber) {
      const room = await Room.findOne({ roomNumber: log.roomNumber });
      if (room) {
        room.status = 'Available';
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Check-out successful. Room is now Available.',
      data: log
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing checkout',
      error: error.message
    });
  }
};

// Get Due Checkouts for Today
exports.getDueCheckouts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueLogs = await Log.find({
      category: 'Room',
      status: 'Active',
      checkoutDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ checkoutDate: 1 });

    res.status(200).json({
      success: true,
      count: dueLogs.length,
      data: dueLogs
    });
  } catch (error) {
    console.error('Error fetching due checkouts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching due checkouts',
      error: error.message
    });
  }
};
