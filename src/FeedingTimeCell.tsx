import { useState } from 'react';
import './FeedingTimeCell.css';

type FeedingTimeCellProps = {
  initialTime?: string;
  onTimeSave: (newTime: string) => void;
}

/** Handles time tracking.
 *
 * CalendarCell -> FeedingTimeCell
*/
function FeedingTimeCell({onTimeSave, initialTime = ''}): FeedingTimeCellProps {
  const [time, setTime] = useState<string>(initialTime);
  const [temporaryTime, setTemporaryTime] = useState<string>(initialTime);
  const [error, setError] = useState<string>('');
  console.log('* FeedingTimeCell');

  /** Updates time as user changes input.
   *
   * Error is reset to an empty string on new input.
  */
  function handleChange (evt: React.ChangeEvent<HTMLInputElement>) {
    setTemporaryTime(evt.target.value);
    setError('');
  };

  /** Validates time format as HH:MM. */
  function validateTime(time: string): boolean {
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  /** Sends updated time to parent on save.
   *
   * If save is not successful, sets errors.
   */
  function handleSave(evt: React.FormEvent<HTMLFormElement>) {
    if (validateTime(temporaryTime)) {
      setTime(temporaryTime);
      onTimeSave(temporaryTime);
    } else {
      setError('Please enter a valid time.');
    }
  }

  return (
    <div className="FeedingTimeCell">
      <div className="input-group">
        <input
          type="time"
          value={temporaryTime}
          onChange={handleChange}
          title='Set time'
        />
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
      {error && <span className="error">{error}</span>}
      <div>
        {time}
      </div>
    </div>
  );
}

export default FeedingTimeCell;