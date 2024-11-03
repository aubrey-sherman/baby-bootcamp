import React, { useMemo } from 'react';
import CalendarCell from './CalendarCell';
import { FeedingBlock, FeedingEntry } from './types';
import './CalenderView.css'

type RemoveFeedingBlock = (blockId: string) => void;
type SetToEliminate = (blockId: string) => void;

type CalendarViewProps = {
  startOfWeek: Date;
  monthAndYear: string;
  feedingBlocks: FeedingBlock[];
  feedingEntries: FeedingEntry[];
  removeFeedingBlock: RemoveFeedingBlock;
  setToEliminate: SetToEliminate;
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
  setToEliminate,
  // onTimeSave
 }: CalendarViewProps) {

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
  }

  /** Handles table cell click for removing a block. */
  function handleClick(evt: React.MouseEvent<HTMLTableCellElement>) {
    const target = evt.target as HTMLElement;
    const blockId = target.getAttribute('data-block-id');
    if (blockId && window.confirm(`Are you sure you want to remove this block?`)) {
      removeFeedingBlock(blockId);
    }
  }

  /** Handles a user's submission to eliminate a block.
   *
   * If no other block is currently set to be eliminated, this will set the
   * isEliminating property to true.
  */
  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    // return only blocks with isEliminating set to true
    const currentBlocksToEliminate = feedingBlocks.filter(
      (feedingBlock) => feedingBlock.isEliminating === true);

    // if there are any blocks already set to be eliminated
    if (currentBlocksToEliminate.length > 0) {
      console.warn("You can only eliminate one block at a time.");
    } else {
      const td = evt.currentTarget.closest('td');
      console.debug("td found", td);
      const blockId = td?.getAttribute('data-block-id');

      if (blockId) {
        setToEliminate(blockId);
      } else {
        console.warn('No corresponding row found.');
      }
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
                <tr key={feedingBlock.id} className={feedingBlock.isEliminating ? "eliminating" : "not-eliminating"}>
                  <td onClick={handleClick} data-block-id={feedingBlock.id}>
                    {feedingBlock.number}
                    <form onSubmit={handleSubmit}>
                      <button type='submit'>Eliminate this block?</button>
                    </form>
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