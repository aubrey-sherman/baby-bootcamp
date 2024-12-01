import React from 'react';
import { DateTime } from 'luxon';
import CalendarCell from './CalendarCell';
import { FeedingBlock } from './types';
import { FeedingEntry } from './types';
import TimezoneHandler from "./helpers/TimezoneHandler";
import './CalenderView.css'

type RemoveFeedingBlock = (blockId: string) => void;
type SetToEliminate = (blockId: string) => void;

type CalendarViewProps = {
  startOfWeek: DateTime;
  monthAndYear: string;
  feedingBlocks: FeedingBlock[];
  currentDate: DateTime;
  deleteFeedingBlock: RemoveFeedingBlock;
  setToEliminate: SetToEliminate;
  onSetEliminationStart?: (entry: FeedingEntry) => void;
  onTimeSave: (blockId: string, entryId: string, newTime: DateTime) => void;
  onAmountSave: (blockId: string, entryId: string, newAmount: number) => void;
}

/** Calendar component.
 *
 * Displayer's the current feeding times for a logged-in user.
 * Uses timezone-aware date handling.
 *
 * CalendarManager -> CalendarView
 */
function CalendarView({
  startOfWeek,
  monthAndYear,
  feedingBlocks,
  currentDate,
  deleteFeedingBlock,
  onSetEliminationStart,
  setToEliminate,
  onTimeSave,
  onAmountSave
 }: CalendarViewProps) {
  const tzHandler = new TimezoneHandler();

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    DateTime.fromObject({
      weekday: (i % 7) + 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7
    })
      .setZone(tzHandler.getCurrentUserTimezone())
      .setLocale('en-US') // Ensures Sunday is treated as first day
      .toFormat('EEE')
  );

  const week = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.plus({ days: i })
  );

  // TODO: Move this up to manager; this component is presentational
  /** Handles table cell click for removing a block. */
  function handleClickToDelete(evt: React.MouseEvent) {
    const targetDiv = evt.currentTarget.closest('div');
    const blockId = targetDiv?.getAttribute('data-block-id');

    if (blockId && window.confirm(`Are you sure you want to remove this block?`)) {
      deleteFeedingBlock(blockId);
    }
  }

  /** Handles a user's submission to eliminate a block.
   *
   * If no other block is currently set to be eliminated, this will set the
   * isEliminating property to true.
  */
  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    // check whether any other block already has a true value
    const currentBlocksToEliminate = feedingBlocks.filter(
      (feedingBlock) => feedingBlock.isEliminating === true
    );

    // if there are any blocks already set to be eliminated
    if (currentBlocksToEliminate.length > 0) {
      console.warn("You can only eliminate one block at a time.");
      // add UI alert
    } else {
      const targetDiv = evt.currentTarget.closest('div');
      const blockId = targetDiv?.getAttribute('data-block-id');

      if (blockId) {
        setToEliminate(blockId);
      } else {
        console.warn('No corresponding row found.');
      }
    }
  }

  // NOTE: Style for browser viewing
  // return (
  //   <div>
  //     <h2>{monthAndYear}</h2>
  //     <div className="calendar-container">
  //       <table className="calendar-table">
  //         <thead>
  //           <tr>
  //             {/* <th>Night Feeding</th> */}
  //             <th>
  //               <div className='cell-content header-content'>
  //                 <span className='truncate'>Night Feeding</span>
  //               </div>
  //             </th>
  //             {week.map((date) => (
  //               <th key={date.toISO()}>
  //                 <div className='cell-content header-content'>
  //                   <span className="truncate">
  //                     {date.toFormat('EEE')}<br />
  //                     {date.toFormat('M/d')}
  //                   </span>
  //                 </div>
  //               </th>
  //             ))}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {feedingBlocks.length > 0 ? (
  //             feedingBlocks
  //                 .sort((a, b) => a.number - b.number)
  //                 .map((feedingBlock: FeedingBlock) => (
  //                   <tr key={feedingBlock.id} className={feedingBlock.isEliminating ? "eliminating" : "not-eliminating"}>
  //                     <td data-block-id={feedingBlock.id}>
  //                       <div className='cell-content data-content'>
  //                         <span className="truncate">
  //                           <svg onClick={handleClickToDelete} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="delete-icon bi bi-trash3-fill" viewBox="0 0 16 16">
  //                             <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
  //                           </svg>
  //                           {feedingBlock.number}
  //                           <form onSubmit={handleSubmit}>
  //                             <button type='submit'>Eliminate this block?</button>
  //                           </form>
  //                         </span>
  //                       </div>
  //                     </td>
  //                     {week.map((date) => {
  //                       const entry = feedingBlock.feedingEntries?.find(entry => {
  //                         const entryDate = tzHandler.parseToUserTimezone(entry.feedingTime);
  //                         const dateToMatch = date;

  //                         return entryDate.hasSame(dateToMatch, 'day');
  //                       });

  //                       return (
  //                         <CalendarCell
  //                           key={date.toISO()}
  //                           date={date}
  //                           currentDate={currentDate}
  //                           feedingEntry={entry}
  //                           onTimeSave={onTimeSave}
  //                           onAmountSave={onAmountSave}
  //                         />
  //                       );
  //                     })}
  //                   </tr>
  //                 ))
  //             ) : (
  //               <tr>
  //                 <td colSpan={daysOfWeek.length + 1} style={{ textAlign: 'center' }}>
  //                   Your baby is sleeping through the night!
  //                 </td>
  //               </tr>
  //             )}
  //          </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

  // NOTE: Style for mobile viewing
  return (
    <div>
      <h2>{monthAndYear}</h2>
      <div className="calendar-container">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>
                <div className='cell-content header-content'>
                  <span className='truncate'>Day</span>
                </div>
              </th>
              {feedingBlocks
                .sort((a, b) => a.number - b.number)
                .map((feedingBlock) => (
                  <th
                    key={feedingBlock.id}
                    className={feedingBlock.isEliminating ? "eliminating" : "not-eliminating"}
                  >
                    <div className='cell-content header-content'>
                      <span className="truncate">
                        <div
                          data-block-id={feedingBlock.id}
                          style={{ display: 'inline-block' }}
                        >
                          <svg
                            onClick={handleClickToDelete}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="delete-icon bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                          </svg>
                          Block {feedingBlock.number}
                          <form onSubmit={handleSubmit}>
                            <button type='submit'>Eliminate this block?</button>
                        </form>
                        </div>
                      </span>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {feedingBlocks.length > 0 ? (
              week.map((date) => (
                <tr key={date.toISO()}>
                  <td>
                    <div className='cell-content data-content'>
                      <span className="truncate">
                        {date.toFormat('EEE')}<br />
                        {date.toFormat('M/d')}
                      </span>
                    </div>
                  </td>
                  {feedingBlocks
                    .sort((a, b) => a.number - b.number)
                    .map((feedingBlock) => {
                      const entry = feedingBlock.feedingEntries?.find(entry => {
                        const entryDate = tzHandler.parseToUserTimezone(entry.feedingTime);
                        const dateToMatch = date;

                        return entryDate.hasSame(dateToMatch, 'day');
                      });

                      return (
                        <td
                          key={`${date.toISO()}-${feedingBlock.id}`}
                          data-block-id={feedingBlock.id}
                        >
                          <CalendarCell
                            // date={date}
                            currentDate={currentDate}
                            feedingEntry={entry}
                            onTimeSave={onTimeSave}
                            onAmountSave={onAmountSave}
                            onSetEliminationStart={onSetEliminationStart}
                            isEliminating={feedingBlock.isEliminating}
                          />
                        </td>
                      );
                    })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={feedingBlocks.length + 1} style={{ textAlign: 'center' }}>
                  Your baby is sleeping through the night!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;