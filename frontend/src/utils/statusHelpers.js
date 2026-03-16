/**
 * Time-Aware State Machine for Log Entries
 * Calculates derived status based on real-time clock logic
 */

/**
 * Get derived status for a log entry based on current date/time
 * @param {Object} log - Log entry object
 * @param {string} checkInTime - Dynamic check-in time from settings (default: '12:00')
 * @returns {Object} - { label: string, color: string, isLive: boolean }
 */
export const getDerivedStatus = (log, checkInTime = '12:00') => {
    // Rule 4: Manual Override - Completed status always takes precedence
    if (log.status === 'Completed') {
        return {
            label: 'Completed',
            color: 'bg-success-green/10 text-success-green border-success-green/20',
            isLive: false
        };
    }

    // Get current date and time
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

    // Parse log date (ignore time-of-day for date comparison)
    const logDate = new Date(log.date);
    const logDateOnly = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());

    // Rule 1: Future Date - Pre-booked
    if (logDateOnly > currentDate) {
        return {
            label: 'Pre-booked',
            color: 'bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30',
            isLive: false
        };
    }

    // Check if log date is today
    const isToday = logDateOnly.getTime() === currentDate.getTime();

    if (isToday) {
        // Rule 5: Alert Mode - Time Over (Events past end time)
        if (log.category === 'Party/Event' && log.endTime) {
            const [endHour, endMinute] = log.endTime.split(':').map(Number);
            const endTimeInMinutes = endHour * 60 + endMinute;

            if (currentTime > endTimeInMinutes) {
                return {
                    label: 'Time Over',
                    color: 'bg-alert-amber/10 text-alert-amber border-alert-amber/20',
                    isLive: false
                };
            }
        }

        // Rule 2: Live Now - Events
        if (log.category === 'Party/Event' && log.startTime) {
            const [startHour, startMinute] = log.startTime.split(':').map(Number);
            const startTimeInMinutes = startHour * 60 + startMinute;

            if (currentTime >= startTimeInMinutes) {
                return {
                    label: 'Live Now',
                    color: 'bg-success-green/10 text-success-green border-success-green/20',
                    isLive: true
                };
            }
        }

        // Rule 3: Active - Rooms (after dynamic check-in time)
        if (log.category === 'Room') {
            const [checkInHour, checkInMinute] = checkInTime.split(':').map(Number);
            const checkInTimeInMinutes = checkInHour * 60 + checkInMinute;

            if (currentTime >= checkInTimeInMinutes) {
                return {
                    label: 'Active',
                    color: 'bg-success-green/10 text-success-green border-success-green/20',
                    isLive: true
                };
            }
        }
    }

    // Default: Pre-booked (for today before activation time or past dates not completed)
    return {
        label: 'Pre-booked',
        color: 'bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30',
        isLive: false
    };
};

/**
 * Count entries with a specific derived status
 * @param {Array} logs - Array of log entries
 * @param {string} targetLabel - Target status label to count
 * @param {string} checkInTime - Dynamic check-in time from settings (default: '12:00')
 * @returns {number} - Count of entries matching the target label
 */
export const countByDerivedStatus = (logs, targetLabel, checkInTime = '12:00') => {
    if (!logs || !Array.isArray(logs)) return 0;

    return logs.filter(log => {
        const derivedStatus = getDerivedStatus(log, checkInTime);
        return derivedStatus.label === targetLabel;
    }).length;
};
