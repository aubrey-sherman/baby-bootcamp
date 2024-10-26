import { useState } from 'react';
import FeedingTimeCell from './FeedingTimeCell';
import FeedingAmountCell from './FeedingAmountCell';
import { FeedingEntry } from './types';

type CalendarCellProps = {
  eventTime?: FeedingEntry['eventTime'];
}

/** Calendar cell component.
 *
 * Displays time and feeding amount (in ounces) for a given day and time block.
 *
 * CalendarView -> CalendarCell -> { TimeCell, AmountCell }
 */
function CalendarCell({ eventTime }: CalendarCellProps) {
  const [time, setTime] = useState<string>(eventTime);
  console.log("* Calendar")

  /** Sends updated time to backend. */
  function onTimeSave(newTime: string): void {
    console.log(`Time is being sent to server as ${newTime}!`);
  }

  return (
    <div className="CalendarCell">
      <FeedingTimeCell
        onTimeSave={onTimeSave}
        initialTime={feedingEntry.eventTime}
      />
      <FeedingAmountCell />
    </div>
  )
}

export default CalendarCell;