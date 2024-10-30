import React, { useMemo } from 'react';
import CalendarCell from './CalendarCell';
import { FeedingBlock, FeedingEntry } from './types';
import './CalenderView.css'

// type RemoveFeedingBlock = (blockId: string) => void;

type CalendarViewProps = {
  startOfWeek: Date;
  monthAndYear: string;
  feedingBlocks: FeedingBlock[];
  feedingEntries: FeedingEntry[];
  // removeFeedingBlock: RemoveFeedingBlock;
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
  // removeFeedingBlock,
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

  // /** Handles table click for removing a block/row. */
  // function handleTableClick(evt: React.MouseEvent<HTMLTableElement>) {
  //   console.debug("Clicked element:", evt)
  //   const target = evt.target as HTMLElement;
  //   const spanElement = target.tagName === 'TD' ? target.querySelector('span') : null;
  //   console.debug(spanElement)

  //   if (spanElement) {
  //     const blockId = spanElement.getAttribute('data-id');
  //     console.log("blockId=", blockId);
  //     if (blockId && window.confirm(`Are you sure you want to remove this block?`)) {
  //       removeFeedingBlock(blockId);
  //     }
  //   }
  // };

  // /** Preprocess feedingEntries into a Map<blockNumber, Map<dateString, FeedingEntry[]>>. */
  // const feedingEntriesMap = useMemo(() => {
  //   const map = new Map<number, Map<string, FeedingEntry[]>>();

  //   feedingEntries.forEach(entry => {
  //     const blockNumber = entry.block;
  //     const dateStr = entry.eventTime.toDateString(); // e.g., 'Mon Aug 23 2021'

  //     if (!map.has(blockNumber)) {
  //       map.set(blockNumber, new Map<string, FeedingEntry[]>());
  //     }

  //     const dateMap = map.get(blockNumber)!;

  //     if (!dateMap.has(dateStr)) {
  //       dateMap.set(dateStr, []);
  //     }

  //     dateMap.get(dateStr)!.push(entry);
  //   });

  //   return map;
  // }, [feedingEntries]);

  // /** Filters feeding entries for a specific block and date. */
  // function getEntriesForCell(blockNumber: number, date: Date): FeedingEntry[] {
  //   const dateStr = date.toDateString();
  //   return feedingEntriesMap.get(blockNumber)?.get(dateStr) || [];
  // };

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
                  <td>{feedingBlock.number}</td>
                  {week.map((date) => (
                    <td key={date.toISOString()}>
                      {date.getDate()}
                      <br />
                      Time:
                      <br />
                      Amount:
                    </td>
                  ))}
                </tr>
            ))
          ) : (
            <tr>
              <td colSpan={daysOfWeek.length+1} style={{ textAlign: 'center' }}>
                No blocks available.
              </td>
            </tr>
          )}
          </tbody>
        </table>
    </div>
    );
};

export default CalendarView;