import React from 'react';
import { DateTime } from 'luxon';
import FeedingTimeCell from './FeedingTimeCell';
import { FeedingEntry } from './types';
import FeedingAmountCell from './FeedingAmountCell';
import TimezoneHandler from './helpers/TimezoneHandler';
import './CalendarCell.css';

type CalendarCellProps = {
  feedingEntry?: FeedingEntry | undefined;
  currentDate: DateTime;
  onTimeSave: (blockId: string, entryId: string, newTime: DateTime) => void;
  onAmountSave: (blockId: string, entryId: string, newAmount: number) => void;
}

/** Calendar cell component displays time and feeding amount (in ounces) for a
 * given day and time block.
 *
 * Props:
 * - feedingEntry
 * - date: DateTime object representing the day
 * - currentDate: DateTime object maintained by CalendarManager
 *
 * State: none
 *
 * Renders:
 * - If feedingEntry exist: displays time for each entry
 * - If no entry: displays time form with currentDate from parent
 *
 * CalendarView -> CalendarCell -> { FeedingTimeCell, FeedingAmountCell }
 */
function CalendarCell({
  feedingEntry,
  currentDate,
  onTimeSave,
  onAmountSave
}: CalendarCellProps) {
  const tzHandler = new TimezoneHandler();

  return (
    <td className={currentDate.hasSame(DateTime.now(), 'day') ? 'current-day' : ''}>
      <div>
        {feedingEntry ? (
          <div className="feeding-entry">
            <FeedingTimeCell
              feedingTime={tzHandler.parseToUserTimezone(feedingEntry.feedingTime)}
              onTimeSave={onTimeSave}
              entryId={feedingEntry.id}
              blockId={feedingEntry.blockId}
            />
            <FeedingAmountCell
              volumeInOunces={feedingEntry.volumeInOunces ? feedingEntry.volumeInOunces : 0}
              onAmountSave={onAmountSave}
              entryId={feedingEntry.id}
              blockId={feedingEntry.blockId}
            />
          </div>
        ) : (
          <div>
            <FeedingTimeCell
              feedingTime={undefined}
              onTimeSave={onTimeSave}
            />
            <FeedingAmountCell
              onAmountSave={onAmountSave}
            />
          </div>
        )}
      </div>
    </td>
  );
}

export default CalendarCell;