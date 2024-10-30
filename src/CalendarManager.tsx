import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FeedingBlock, FeedingEntry } from './types.ts'
import CalendarView from "./CalendarView.tsx";

type CalendarManagerProps = {
  initialFeedingEntries: FeedingEntry[];
  initialFeedingBlocks: FeedingBlock[];
}

/** CalendarManager handles the logic for the calender view.
 *
 * Calculates dates, and adds/removes feeding blocks.
 *
 * CalendarManager -> CalenderView
 */
function CalendarManager({ initialFeedingEntries = [], initialFeedingBlocks = [] }: CalendarManagerProps) {

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [feedingBlocks, setFeedingBlocks] = useState<FeedingBlock[]>(initialFeedingBlocks);
  const [feedingEntries, setFeedingEntries] = useState<FeedingEntry[]>(initialFeedingEntries);

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault();
      if (feedingBlocks.length === 0) {
        addFeedingBlock(1);
      } else {
        const lastBlock = feedingBlocks[feedingBlocks.length-1].number;
        const newBlock = lastBlock + 1;
        addFeedingBlock(newBlock);
      }
  }

  /** Creates and adds a new feeding block to the calendar with a unique ID. */
  function addFeedingBlock(blockNumber: number) {
    const newFeedingBlock: FeedingBlock = {
      id: uuidv4(), // or block-number?
      number: feedingBlocks.length + 1
    }
    // TODO: Send to database via the API
    setFeedingBlocks((previousBlocks) => [...previousBlocks, newFeedingBlock]);
    console.log(`CalendarManager added new block: ${newFeedingBlock}`);
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  /** Calculates the start of the current week (Sunday) based on current date. */
  function getStartOfWeek(date: Date): Date {
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);

      startOfWeek.setDate(date.getDate() - dayOfWeek);

      return startOfWeek;
  };

  /** Modifies currentDate by subtracting 7 days to navigate between weeks. */
  function handlePreviousWeek() {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeekDate);
    }

  /** Modifies currentDate by adding 7 days to navigate between weeks. */
  function handleNextWeek() {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeekDate);
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const monthAndYear = startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className='CalendarManager'>
      <button onClick={handlePreviousWeek}>Previous week</button>
      <button onClick={handleNextWeek}>Next week</button>
      <form onSubmit={handleSubmit}>
        <button type='submit'>Add a feeding block</button>
      </form>
      <CalendarView
        startOfWeek={startOfWeek}
        monthAndYear={monthAndYear}
        feedingBlocks={feedingBlocks}
        feedingEntries={feedingEntries}
      />
    </div>
  );
};

export default CalendarManager;