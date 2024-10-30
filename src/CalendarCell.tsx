import React, { useState } from 'react';
import FeedingTimeCell from './FeedingTimeCell';
import FeedingAmountCell from './FeedingAmountCell';
import { FeedingEntry } from './types';
import { formatDateToTimeString } from './helpers/utils';
import './CalendarCell.css';

type CalendarCellProps = {
  blockId: string;
  blockNumber: number;
  date: Date;
  feedingEntries: FeedingEntry[];
  // onTimeSave: (entryId: string, newEventTime: Date) => void;
}

/** Calendar cell component.
 *
 * Displays time and feeding amount (in ounces) for a given day and time block.
 *
 * CalendarView -> CalendarCell -> { TimeCell, AmountCell }
 */
function CalendarCell({ blockId, blockNumber, date, feedingEntries }: CalendarCellProps) {
  console.log("* CalendarCell")

  return (
    <td className="CalendarCell">
      {feedingEntries.length > 0 ? (
        feedingEntries.map(entry => (
          <div key={entry.id} className="feeding-entry">
            "Cell"
            {/* <FeedingTimeCell
              eventTime={entry.eventTime}
              onTimeSave={(newTime) => onTimeSave(entry.id, newTime)} /> */}
          </div>
        ))
      ) : (
        <span className="no-entries">No entries!</span>
      )}
    </td>
  );
}

export default CalendarCell;