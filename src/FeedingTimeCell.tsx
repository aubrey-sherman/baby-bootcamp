import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Typography,
  Stack,
} from '@mui/material';
import TimezoneHandler from './helpers/TimezoneHandler';

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
  const timezoneAbbr = DateTime.local().setZone(userTimezone).toFormat('ZZZZ');

  return (
    <Box sx={{ p: 1 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="caption" color="text.secondary">
            Select Time in {timezoneAbbr}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 70 }} error={!!errors.hour}>
              <InputLabel id="hour-label">Hour</InputLabel>
              <Select
                labelId="hour-label"
                value={hour}
                label="Hour"
                onChange={(e) => {
                  setHour(e.target.value);
                  if (submitted) validateTime();
                }}
              >
                {hours.map(h => (
                  <MenuItem key={h} value={h}>{h}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6">:</Typography>

            <FormControl size="small" sx={{ minWidth: 70 }} error={!!errors.minute}>
              <InputLabel id="minute-label">Min</InputLabel>
              <Select
                labelId="minute-label"
                value={minute}
                label="Min"
                onChange={(e) => {
                  setMinute(e.target.value);
                  if (submitted) validateTime();
                }}
              >
                {minutes.map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 70 }}>
              <InputLabel id="period-label">AM/PM</InputLabel>
              <Select
                labelId="period-label"
                value={period}
                label="AM/PM"
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {errors.hour && (
            <Alert severity="error" sx={{ py: 0.5 }}>{errors.hour}</Alert>
          )}
          {errors.minute && (
            <Alert severity="error" sx={{ py: 0.5 }}>{errors.minute}</Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={Object.keys(errors).length > 0 && submitted}
          >
            Set Time
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default FeedingTimeCell;