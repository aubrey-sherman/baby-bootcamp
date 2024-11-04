import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './FeedingTimeCell.css';

type FeedingTimeCellProps = {
  eventTime: Date;
  updateTime: (newEventTime: Date) => void;
}

type TimeErrors = {
  hour?: string;
  minute?: string;
}

/** Displays and allows editing of the feeding time.
 *
 * CalendarCell -> FeedingTimeCell
*/
function FeedingTimeCell({ eventTime, updateTime }: FeedingTimeCellProps) {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [errors, setErrors] = useState<TimeErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Initialize time from eventTime prop
  useEffect(() => {
    if (eventTime instanceof Date) {
      const hours = eventTime.getHours();
      const minutes = eventTime.getMinutes();

      // Convert 24h to 12h format
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;

      setHour(String(displayHours).padStart(2, '0'));
      setMinute(String(minutes).padStart(2, '0'));
      setPeriod(period);
    }
  }, [eventTime]);

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  );

  function validateTime() {
    const newErrors: TimeErrors = {};

    // Validate hour
    const hourNum = parseInt(hour);
    if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) {
      newErrors.hour = 'Please select a valid hour (1-12)';
    }

    // Validate minute
    const minuteNum = parseInt(minute);
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      newErrors.minute = 'Please select a valid minute (0-59)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (validateTime()) {
      // Convert 12h time to 24h Date object
      const currentDate = eventTime || new Date();
      const newDate = new Date(currentDate);

      let hours = parseInt(hour);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      newDate.setHours(hours);
      newDate.setMinutes(parseInt(minute));
      newDate.setSeconds(0);

      updateTime(newDate);
    }
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Select Time</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {/* Hour Select */}
          <select
            value={hour}
            onChange={(e) => {
              setHour(e.target.value);
              if (submitted) validateTime();
            }}
            className={`p-2 border rounded-md bg-white ${errors.hour ? 'border-red-500' : 'border-gray-200'}`}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <span className="text-xl">:</span>

          {/* Minute Select */}
          <select
            value={minute}
            onChange={(e) => {
              setMinute(e.target.value);
              if (submitted) validateTime();
            }}
            className={`p-2 border rounded-md bg-white ${errors.minute ? 'border-red-500' : 'border-gray-200'}`}
          >
            {minutes.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* AM/PM Select */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="p-2 border rounded-md bg-white border-gray-200"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        {/* Error Messages */}
        {errors.hour && (
          <div className="text-red-500 text-sm mb-2">{errors.hour}</div>
        )}
        {errors.minute && (
          <div className="text-red-500 text-sm mb-2">{errors.minute}</div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={Object.keys(errors).length > 0 && submitted}
        >
          Set Time
        </button>
      </form>
    </div>
  );
}

export default FeedingTimeCell;