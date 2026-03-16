const Log = require('../models/Log');
const Room = require('../models/Room');

// Create a new log entry
exports.createLog = async (req, res) => {
  try {
    const { date, source, category, description, units, duration, unitPrice, roomNumber, customerName, startTime, endTime, status, phoneNumber } = req.body;

    // Validate based on category
    if (category === 'Room') {
      if (!roomNumber || !customerName) {
        return res.status(400).json({
          success: false,
          message: 'Room Number and Customer Name are required for Room logs'
        });
      }
      if (!phoneNumber || !/^[0-9]{10}$/.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Valid 10-digit phone number is required for Room logs'
        });
      }
    }

    if (category === 'Restaurant') {
      if (!description || description.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Description (min 3 characters) is required for Restaurant logs'
        });
      }
    }

    if (category === 'Party/Event') {
      if (!description || description.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Description (min 3 characters) is required for Party/Event logs'
        });
      }
      if (!startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: 'Start Time and End Time are required for Party/Event logs'
        });
      }
      if (!phoneNumber || !/^[0-9]{10}$/.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Valid 10-digit phone number is required for Party/Event logs'
        });
      }
    }

    // Validate duration and unit price
    if (!duration || parseInt(duration) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be at least 1 day'
      });
    }

    if (unitPrice === undefined || unitPrice === null || parseFloat(unitPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Unit price must be 0 or greater'
      });
    }

    // Calculate checkout date (date + duration days)
    const logDate = date ? new Date(date) : new Date();
    const checkoutDate = new Date(logDate);
    checkoutDate.setDate(checkoutDate.getDate() + (Number(duration) || 1));

    // FORCE STATUS TO COMPLETED FOR RESTAURANT
    let finalStatus = status || 'Active';
    if (category === 'Restaurant') {
      finalStatus = 'Completed';
    }

    const log = new Log({
      date: logDate,
      source,
      category,
      description,
      roomNumber,
      customerName,
      phoneNumber,
      checkoutDate,
      units: units || 1,
      duration: duration || 1,
      unitPrice,
      startTime,
      endTime,
      status: finalStatus
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

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
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
      customerName,
      phoneNumber,
      startTime,
      endTime
    } = req.body;

    let log = await Log.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log entry not found'
      });
    }

    const newCategory = category || log.category;

    // Validate based on category
    if (newCategory === 'Room') {
      const finalRoomNumber = roomNumber !== undefined ? roomNumber : log.roomNumber;
      const finalCustomerName = customerName !== undefined ? customerName : log.customerName;
      const finalPhoneNumber = phoneNumber !== undefined ? phoneNumber : log.phoneNumber;

      if (!finalRoomNumber) {
        return res.status(400).json({
          success: false,
          message: 'Room Number is required for Room logs'
        });
      }
      if (!finalCustomerName || finalCustomerName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Customer Name (min 2 characters) is required for Room logs'
        });
      }
      if (!finalPhoneNumber || !/^[0-9]{10}$/.test(finalPhoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Valid 10-digit phone number is required for Room logs'
        });
      }
    }

    if (newCategory === 'Restaurant') {
      const finalDescription = description !== undefined ? description : log.description;
      if (!finalDescription || finalDescription.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Description (min 3 characters) is required for Restaurant logs'
        });
      }
    }

    if (newCategory === 'Party/Event') {
      const finalDescription = description !== undefined ? description : log.description;
      const finalStartTime = startTime !== undefined ? startTime : log.startTime;
      const finalEndTime = endTime !== undefined ? endTime : log.endTime;
      const finalPhoneNumber = phoneNumber !== undefined ? phoneNumber : log.phoneNumber;

      if (!finalDescription || finalDescription.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Description (min 3 characters) is required for Party/Event logs'
        });
      }
      if (!finalStartTime || !finalEndTime) {
        return res.status(400).json({
          success: false,
          message: 'Start Time and End Time are required for Party/Event logs'
        });
      }
      if (!finalPhoneNumber || !/^[0-9]{10}$/.test(finalPhoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Valid 10-digit phone number is required for Party/Event logs'
        });
      }
    }

    // Validate duration
    const newDuration = duration !== undefined ? duration : log.duration;
    if (parseInt(newDuration) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be at least 1 day'
      });
    }

    // Validate unit price
    const newUnitPrice = unitPrice !== undefined ? unitPrice : log.unitPrice;
    if (parseFloat(newUnitPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Unit price must be 0 or greater'
      });
    }

    // Handle Category Change (Releasing room if category is changed away from 'Room')
    if (log.category === 'Room' && category && category !== 'Room') {
      if (log.roomNumber) {
        const oldRoom = await Room.findOne({ roomNumber: log.roomNumber });
        if (oldRoom) {
          oldRoom.status = 'Available';
          await oldRoom.save();
          // We also clear the roomNumber from the log since it's no longer a room booking
          log.roomNumber = '';
        }
      }
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

    // 3. Status Change Logic (Auto-Release Room)
    let newStatus = req.body.status;

    // FORCE STATUS TO COMPLETED FOR RESTAURANT
    if (newCategory === 'Restaurant') {
      newStatus = 'Completed';
    }

    if (newStatus === 'Completed' && log.status !== 'Completed') {
      if ((newCategory === 'Room' || log.category === 'Room') && (roomNumber || log.roomNumber)) {
        const rNum = roomNumber || log.roomNumber;
        const roomToRelease = await Room.findOne({ roomNumber: rNum });
        if (roomToRelease) {
          roomToRelease.status = 'Available';
          await roomToRelease.save();
        }
      }
    }

    // 4. Update Log Fields
    log.date = date || log.date;
    log.source = source || log.source;
    log.category = category || log.category;
    log.description = description || log.description;
    log.units = units ?? log.units;
    log.duration = duration ?? log.duration;
    log.unitPrice = unitPrice ?? log.unitPrice;
    log.roomNumber = roomNumber !== undefined ? roomNumber : log.roomNumber;
    log.customerName = customerName !== undefined ? customerName : log.customerName;
    log.phoneNumber = phoneNumber !== undefined ? phoneNumber : log.phoneNumber;
    log.startTime = startTime !== undefined ? startTime : log.startTime;
    log.endTime = endTime !== undefined ? endTime : log.endTime;
    log.status = newStatus || log.status;
    log.checkoutDate = checkoutDate;

    // Save triggers pre-save hook which recalculates totalAmount
    await log.save();

    res.status(200).json({
      success: true,
      data: log
    });

  } catch (error) {
    console.error('Error updating log:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all log entries (sorted by date descending)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: -1, createdAt: -1 });

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

    const log = await Log.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log entry not found'
      });
    }

    if (log.category === 'Room' && log.roomNumber) {
      const room = await Room.findOne({ roomNumber: log.roomNumber });
      if (room) {
        room.status = 'Available';
        await room.save();
      }
    }


    await Log.findByIdAndDelete(id);

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


// Reset Month (Archive) - Delete all except Active Rooms
exports.resetMonth = async (req, res) => {
  try {
    // Delete all logs where:
    // 1. Category is NOT 'Room' (Restaurant, Event, etc.)
    // OR
    // 2. Status is 'Completed' (Completed Rooms)

    const result = await Log.deleteMany({
      $or: [
        { category: { $ne: 'Room' } },
        { status: 'Completed' }
      ]
    });

    res.status(200).json({
      success: true,
      message: `Monthly reset successful. ${result.deletedCount} entries archived and removed.`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Error resetting month:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting month',
      error: error.message
    });
  }
};
