import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
// import { Clock } from 'lucide-react';
import TimezoneHandler from './helpers/TimezoneHandler';
import './FeedingTimeCell.css';

type FeedingTimeCellProps = {
  blockId?: string,
  entryId?: string,
  feedingTime?: DateTime;
  onTimeSave: (
    blockId: string, entryId: string, newTime: DateTime
  ) => void;
}

type TimeErrors = {
  hour?: string;
  minute?: string;
}

/** Displays and allows editing of the feeding time.
 *
 * Manages state for time form.
 *
 * CalendarCell -> FeedingTimeCell
*/
function FeedingTimeCell({
  blockId,
  entryId,
  feedingTime,
  onTimeSave
}: FeedingTimeCellProps) {
  const tzHandler = new TimezoneHandler();
  const defaultTime = DateTime.now().setZone(tzHandler.getCurrentUserTimezone());

  const timeToUse = feedingTime
    ? tzHandler.parseToUserTimezone(feedingTime.toISO())
    : defaultTime;

  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [errors, setErrors] = useState<TimeErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const localTime = timeToUse;

    // Convert to 12-hour format
    const hours = localTime.hour;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    setHour(String(displayHours).padStart(2, '0'));
    setMinute(String(localTime.minute).padStart(2, '0'));
    setPeriod(period);
  }, [feedingTime?.toISO()]);

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
      // Convert time to 24-hour format using DateTime
      let hours = parseInt(hour);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      // Use the existing date from timeToUse, only update the time components
      const existingDate = timeToUse;

      const newTime = timeToUse.set({
        hour: hours,
        minute: parseInt(minute),
        second: 0,
        millisecond: 0
      });

      onTimeSave(blockId!, entryId!, newTime);
    }
  }

  const userTimezone = tzHandler.getCurrentUserTimezone();
  // const timezoneName = DateTime.local().setZone(userTimezone).zoneName;
  const timezoneAbbr = DateTime.local().setZone(userTimezone).toFormat('ZZZZ');

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="">
            {/* <Clock className="clock"/> */}
            <span className="directions timezone">Select Time in {timezoneAbbr}</span>
          </div>
        </div>

        <div className="time-selectors">
          <select
            value={hour}
            onChange={(e) => {
              setHour(e.target.value);
              if (submitted) validateTime();
            }}
            className={`time-select ${errors.hour ? 'time-select-error' : 'border-gray-200'}`}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <span className="time-separator">:</span>

          <select
            value={minute}
            onChange={(e) => {
              setMinute(e.target.value);
              if (submitted) validateTime();
            }}
            className={`time-select ${errors.minute ? 'time-select-error' : ''}`}
          >
            {minutes.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="time-select"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>

        {errors.hour && (
          <div className="error-message">{errors.hour}</div>
        )}
        {errors.minute && (
          <div className="error-message">{errors.minute}</div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={Object.keys(errors).length > 0 && submitted}
        >
          Set Time
        </button>
      </form>
    </div>
  );
}

export default FeedingTimeCell;