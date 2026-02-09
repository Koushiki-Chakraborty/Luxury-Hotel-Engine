import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const AdminBookings = () => {
  const [rooms, setRooms] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, logsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms?limit=100'),
        axios.get('http://localhost:5000/api/logs?limit=500') // Get reasonable amount of recent logs
      ]);
      
      // Sort rooms numerically
      const sortedRooms = (roomsRes.data.data || []).sort((a, b) => 
        a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
      );
      
      setRooms(sortedRooms);
      setLogs(logsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate array of 14 dates starting from startDate
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  // Helper to check if a room is booked on a specific date
  // Returns the log if booked, null otherwise
  const getBookingForDate = (roomNumber, date) => {
    // Normalize date to YYYY-MM-DD for comparison
    const targetDateStr = date.toLocaleDateString('en-CA');
    
    return logs.find(log => {
      if (log.category !== 'Room' || log.roomNumber !== roomNumber || log.status === 'Completed') return false;
      
      // Check if date falls within check-in (log.date) and check-out (log.checkoutDate)
      const checkIn = new Date(log.date).toLocaleDateString('en-CA');
      const checkOut = log.checkoutDate ? new Date(log.checkoutDate).toLocaleDateString('en-CA') : checkIn;
      
      return targetDateStr >= checkIn && targetDateStr < checkOut;
    });
  };

  const shiftDate = (days) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    setStartDate(newDate);
  };

  if (loading) {
    return <div className="p-8 text-center text-rich-espresso">Loading calendar...</div>;
  }

  return (
    <div className="p-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-deep-charcoal">Master Calendar</h1>
          <p className="text-rich-espresso font-lato">14-Day Room Occupancy View</p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={() => shiftDate(-14)} 
                className="p-2 hover:bg-warm-cream rounded-full transition-colors"
                title="Previous 14 Days"
            >
                <ChevronLeft className="text-deep-charcoal" />
            </button>
            <span className="font-playfair font-bold text-lg">
                {dates[0].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {dates[13].toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button 
                onClick={() => shiftDate(14)}
                className="p-2 hover:bg-warm-cream rounded-full transition-colors"
                title="Next 14 Days"
            >
                <ChevronRight className="text-deep-charcoal" />
            </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto border border-pale-champagne rounded-lg bg-white shadow-luxury">
        <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-soft-ivory z-10 shadow-sm">
                <tr>
                    <th className="p-3 border-b border-r border-pale-champagne min-w-[100px] text-left font-playfair font-bold text-deep-charcoal bg-soft-ivory sticky left-0 z-20">
                        Room
                    </th>
                    {dates.map((date, index) => (
                        <th key={index} className="p-2 border-b border-pale-champagne min-w-[120px] text-center">
                            <div className={`font-lato font-bold ${
                                date.toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA') 
                                ? 'text-champagne-gold' 
                                : 'text-rich-espresso'
                            }`}>
                                {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                            </div>
                            <div className="text-xs text-soft-taupe">
                                {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rooms.map(room => (
                    <tr key={room._id} className="hover:bg-warm-cream/30 transition-colors">
                        <td className="p-3 border-b border-r border-pale-champagne font-bold text-deep-charcoal bg-white sticky left-0 z-10">
                            {room.roomNumber}
                             <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block ${
                                room.status === 'Available' ? 'bg-success-green/10 text-success-green' :
                                room.status === 'Maintenance' ? 'bg-error-burgundy/10 text-error-burgundy' :
                                'bg-info-navy/10 text-info-navy'
                            }`}>
                                {room.status}
                             </div>
                        </td>
                        {dates.map((date, index) => {
                            const booking = getBookingForDate(room.roomNumber, date);
                            const isMaintenance = room.status === 'Maintenance';
                            
                            return (
                                <td key={index} className="p-1 border-b border-pale-champagne h-16 relative">
                                    {isMaintenance ? (
                                        <div className="w-full h-full bg-error-burgundy/10 rounded border border-error-burgundy/20 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-error-burgundy rotate-3">Maint.</span>
                                        </div>
                                    ) : booking ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full h-full bg-champagne-gold rounded shadow-sm border border-muted-gold flex flex-col justify-center px-1 cursor-default group relative"
                                        >
                                            <span className="text-xs font-bold text-deep-charcoal truncate">
                                                {booking.customerName}
                                            </span>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-deep-charcoal text-white text-xs p-2 rounded z-50 whitespace-nowrap">
                                                {booking.customerName} (Checkout: {new Date(booking.checkoutDate).toLocaleDateString()})
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="w-full h-full bg-success-green/5 rounded border border-transparent hover:border-success-green/30 transition-colors"></div>
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
