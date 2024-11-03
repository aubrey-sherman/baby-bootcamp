import React, { useState } from 'react';
import './FeedingTimeCell.css';
import { formatDateToTimeString } from './helpers/utils.ts';

type FeedingTimeCellProps = {
  eventTime: Date;
  onTimeSave: (newEventTime: Date) => void;
}

/** Displays and allows editing of the feeding time.
 *
 * CalendarCell -> FeedingTimeCell
*/
function FeedingTimeCell({ eventTime, onTimeSave }): FeedingTimeCellProps {
  const [temporaryTime, setTemporaryTime] = useState<string>(formatDateToTimeString(eventTime));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  /** Updates time as user changes input.
   *
   * Error is reset to an empty string on new input.
  */
  function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
    setTemporaryTime(evt.target.value);
    setError('');
  };

  // /** Validates time format as HH:MM. */
  // function validateTime(time: string): boolean {
  //   const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
  //   return timeRegex.test(time);
  // }

  /** Converts 'HH:MM' to Date. */
  function convertTimeStringToDate(timeStr: string): Date | null {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }
    const newDate = new Date(eventTime); // Preserve the original date
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }

  /** Sends updated time to parent on save.
   *
   * If save is not successful, sets errors.
   */
  function handleSave(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const newDate = convertTimeStringToDate(temporaryTime);
    if (newDate) {
      onTimeSave(newDate);
      setIsEditing(false);
      setError('');
    } else {
      setError('Please enter a valid time in HH:MM format.');
    }
  };

  return (
    <div className="FeedingTimeCell">
      {isEditing ? (
        <form onSubmit={handleSave} className="feeding-time-form">
          <input
            type="time"
            value={temporaryTime}
            onChange={handleChange}
            required
            className="feeding-time-input"
          />
          <button type="submit" className="feeding-time-save-button">Save</button>
          <button
            type="button"
            onClick={() => {setIsEditing(false); setError(''); }}
            className="feeding-time-cancel-button"
          >
            Cancel
          </button>
          {error && <span className="feeding-time-error">{error}</span>}
        </form>
      ) : (
        <div className="feeding-time-display">
          <strong>Time:</strong> {formatDateToTimeString(eventTime)}
          <button onClick={() => setIsEditing(true)} className="feeding-time-edit-button">
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default FeedingTimeCell;