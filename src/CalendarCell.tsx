import React, { useState } from 'react';
import FeedingTimeCell from './FeedingTimeCell';
import FeedingAmountCell from './FeedingAmountCell';
import { FeedingEntry } from './types';
import { formatDateToTimeString } from './helpers/utils';
import './CalendarCell.css';

type CalendarCellProps = {
  feedingEntries: FeedingEntry[];
  date: number;
}

/** Calendar cell component.
 *
 * Displays time and feeding amount (in ounces) for a given day and time block.
 *
 * CalendarView -> CalendarCell -> { TimeCell, AmountCell }
 */
function CalendarCell({ feedingEntries, date }: CalendarCellProps) {

  function updateTime(newDate: Date) {
    // TODO: Send to database
    console.log('Saving new date:', newDate);
  };

  return (
    <td className="CalendarCell">
      Today is {date}
      {feedingEntries.map(entry => (
          <div key={entry.id} className="feeding-entry">
            <FeedingTimeCell
              eventTime={entry.eventTime}
              updateTime={updateTime}
            />
          </div>
    ))}
    </td>
  );
}

export default CalendarCell;