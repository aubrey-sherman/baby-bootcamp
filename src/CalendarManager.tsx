import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FeedingBlock, FeedingEntry } from './types.ts'
import CalendarView from "./CalendarView.tsx";

type CalendarManagerProps = {
  feedingEntries?: FeedingEntry[];
}

/** CalendarManager handles the logic for the calender view.
 *
 * Calculates dates, and adds/removes feeding blocks.
 *
 * CalendarManager -> CalenderView
 */
function CalendarManager({ feedingEntries }: CalendarManagerProps) {

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [feedingBlocks, setFeedingBlocks] = useState<FeedingBlock[]>([]);

  /** Adds a feeding block to the calendar. */
  function addFeedingBlock(blockToAdd: number) {
    console.log("block to add", blockToAdd);
    const newFeedingBlock = { id: uuidv4(), number: feedingBlocks.length + 1 }
    setFeedingBlocks([...feedingBlocks, newFeedingBlock]);
  }

  /** Removes a feeding block from the calendar. */
  function removeFeedingBlock(blockId: string) {
    const updatedBlocks = feedingBlocks.filter(block => block.id !== blockId);

    const renumberedBlocks = updatedBlocks.map((block: FeedingBlock, index: number) => ({
      ...block,
      number: index + 1,
    }));

    setFeedingBlocks(renumberedBlocks);
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  /** Calculates the start of the current week (Sunday) based on current date. */
  function getStartOfWeek(date: Date) {
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
  const monthAndYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className='CalendarManager'>
      <button onClick={handlePreviousWeek}>Previous week</button>
      <button onClick={handleNextWeek}>Next week</button>

      <form onSubmit={(evt) => {
        evt.preventDefault();
        if (feedingBlocks.length === 0) {
          addFeedingBlock(1);
        } else {
          const lastBlock = feedingBlocks[feedingBlocks.length-1].number;
          const newBlock = lastBlock + 1;
          addFeedingBlock(newBlock);
        }
      }}>
        {/* <input type='text' name='block' placeholder='Add new feeding block' /> */}
        <button type='submit'>Add a feeding block</button>
      </form>
      <CalendarView
        startOfWeek={startOfWeek}
        monthAndYear={monthAndYear}
        feedingBlocks={feedingBlocks}
        feedingEntries={feedingEntries}
        removeFeedingBlock={removeFeedingBlock}
      />
    </div>
  );
};

export default CalendarManager;