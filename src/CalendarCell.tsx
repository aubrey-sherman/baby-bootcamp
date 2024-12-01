import React from 'react';
import { DateTime } from 'luxon';
import FeedingTimeCell from './FeedingTimeCell';
import { FeedingEntry } from './types';
import FeedingAmountCell from './FeedingAmountCell';
import TimezoneHandler from './helpers/TimezoneHandler';
import './CalendarCell.css';

type CalendarCellProps = {
  isEliminating?: boolean;
  feedingEntry?: FeedingEntry | undefined;
  currentDate: DateTime;
  onSetEliminationStart?: (entry: FeedingEntry) => void;
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
  isEliminating = false,
  onTimeSave,
  onAmountSave,
  onSetEliminationStart
}: CalendarCellProps) {

  const tzHandler = new TimezoneHandler();

  return (
    <td className={currentDate.hasSame(DateTime.now(), 'day') ? 'current-day' : ''}>
      <div>
        {feedingEntry ? (
          <div className="feeding-entry">
          { isEliminating &&
            <button
              onClick={() => onSetEliminationStart?.(feedingEntry)}
              className="elimination-start-icon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
              Start counting down here
            </button>
          }
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