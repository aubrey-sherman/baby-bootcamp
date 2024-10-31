import React, { useMemo } from 'react';
import CalendarCell from './CalendarCell';
import { FeedingBlock, FeedingEntry } from './types';
import './CalenderView.css'

type RemoveFeedingBlock = (blockId: string) => void;

type CalendarViewProps = {
  startOfWeek: Date;
  monthAndYear: string;
  feedingBlocks: FeedingBlock[];
  feedingEntries: FeedingEntry[];
  removeFeedingBlock: RemoveFeedingBlock;
  // onTimeSave: (entryId: string, newEventTime: Date) => void;
  }

/** Calendar component.
 *
 * Displayer's the current feeding times for a logged-in user.
 *
 * CalendarManager -> CalendarView
 */
function CalendarView({
  startOfWeek,
  monthAndYear,
  feedingBlocks,
  feedingEntries = [],
  removeFeedingBlock,
  // onTimeSave
 }: CalendarViewProps) {
  console.log("* CalendarView", feedingEntries)
  console.log('CalendarTable received feedingBlocks:', feedingBlocks);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
  }

  /** Handles table cell click for removing a block. */
  function handleClick(evt: React.MouseEvent<HTMLTableCellElement>) {
    console.debug("Clicked element:", evt);
    const target = evt.target as HTMLElement;
    console.debug("target=", target);
    const blockId = target.getAttribute('data-block-id');
    if (blockId && window.confirm(`Are you sure you want to remove this block?`)) {
      removeFeedingBlock(blockId);
    }
  }

  return (
    <div>
      <h2>{monthAndYear}</h2>
        <table>
          <thead>
            <tr>
              <th>Night Feeding</th>
              {daysOfWeek.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feedingBlocks.length > 0 ? (
              feedingBlocks.map((feedingBlock: FeedingBlock) => (
                <tr key={feedingBlock.id}>
                  <td onClick={handleClick} data-block-id={feedingBlock.id}>
                    {feedingBlock.number}
                  </td>
                  {week.map((date) => (
                    <CalendarCell
                      key={date.toISOString()}
                      date={date.getDate()}
                    />
                  ))}
                </tr>
            ))
          ) : (
            <tr>
              <td colSpan={daysOfWeek.length+1} style={{ textAlign: 'center' }}>
                Your baby is sleeping through the night!
              </td>
            </tr>
          )}
          </tbody>
        </table>
    </div>
    );
};

export default CalendarView;