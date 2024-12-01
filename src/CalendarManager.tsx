import { useState, useEffect } from "react";
import { DateTime } from 'luxon';
import { FeedingBlock } from './types.ts';
import { FeedingEntry } from './types.ts';
import CalendarView from "./CalendarView.tsx";
import BabyBootcampApi from "./api/api.ts";
import TimezoneHandler from "./helpers/TimezoneHandler.ts";
import { VolumeIcon } from "lucide-react";

/** CalendarManager handles the logic for the calender view.
 *
 * Manages date calculations, week navigation, and feeding block operations
 * with timezone-aware date handling.
 *
 * Eat -> CalendarManager -> CalenderView
 */
function CalendarManager() {
  const tzHandler = new TimezoneHandler();
  const [feedingBlocks, setFeedingBlocks] = useState<FeedingBlock[]>([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(
    DateTime.now()
      .setZone(tzHandler.getCurrentUserTimezone())
      .startOf('day')
  );

  // Fetches feeding blocks and entries on mount.
  useEffect(() => {
    async function fetchBlocksWithEntries() {
      const blocksAndEntries = await BabyBootcampApi.getUserBlocksWithEntries();

      setFeedingBlocks(blocksAndEntries);
      setInfoLoaded(true);
    }

    fetchBlocksWithEntries();
  }, []);

  // *** Logic for blocks *** //

  /** Handles the creation of a new feeding block. */
  async function handleAddBlock(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault();
      setIsSubmitting(true);
      setError(null);
      try {
        const newBlock = await BabyBootcampApi.createBlockWithEntries();
        setFeedingBlocks([...feedingBlocks, newBlock])
      } catch (err) {
        setError(Array.isArray(err) ? err[0] : 'Failed to create block');
      } finally {
        setIsSubmitting(false);
      }
  }

  // TODO: Change from deleting to hiding to keep historical data
  /** Handles the deletion of a feeding block. */
  async function handleDeleteBlock(blockId: string) {
    setSubmittingId(blockId);
    setError(null);

    try {
      await BabyBootcampApi.deleteBlock(blockId);
      const updatedBlocks = await BabyBootcampApi.getUserBlocksWithEntries();
      setFeedingBlocks(updatedBlocks);
    } catch (err) {
      setError(Array.isArray(err) ? err[0] : 'Failed to delete block');
    } finally {
      setSubmittingId(null);
    }
  }

  /** Changes the isEliminating property of a specific block to true.
  */
  async function setToEliminate(blockId: string) {
    if (!blockId) {
      console.error('Id required for update.')
      return;
    }

    const previousBlocks = [...feedingBlocks];

    try {
      await BabyBootcampApi.updateIsEliminating(true, blockId);
      const blocksAndEntries = await BabyBootcampApi.getUserBlocksWithEntries();
      setFeedingBlocks(blocksAndEntries);
    } catch (error) {
      console.error("Update failed:", error);
    }
  }

  /** Sets the date to start decreasing the feeding amount for a block. */
  async function handleSetEliminationStart(entry: FeedingEntry) {
    try {
      const dateTime = DateTime.fromISO(entry.feedingTime);

      await BabyBootcampApi.setStartDateForElimination(
        entry.volumeInOunces ?? 0,
        entry.blockId,
        dateTime
      );

      const blocksAndEntries = await BabyBootcampApi.getUserBlocksWithEntries();
      setFeedingBlocks(blocksAndEntries);
    } catch (err) {
      console.error("Failed to set elimination start:", err);
    }
  }


  // Logic for entries

  // FIXME: Is entryId needed for this function?
  /** Handles time updates for feeding entries. When a user saves a new time, this
   * and all subsequent entries in the row are updated.
   *
   * If API call fails, re-renders with the previous state.
   */
  async function handleTimeSave(blockId: string, entryId: string, newTime: DateTime) {
    if (!blockId) {
      return;
    }

    const previousBlocks = [...feedingBlocks];

    try {
      const updatedBlock = await BabyBootcampApi.updateTime(blockId, newTime);

      setFeedingBlocks(previousBlocks =>
        previousBlocks.map(block =>
          block.id === blockId ? {
            ...updatedBlock,
            feedingEntries: updatedBlock.feedingEntries ?? []
          } : block
        )
      );
    } catch (error) {
      console.error("Update failed:", error);
      setFeedingBlocks(previousBlocks);
    }
  }

  /** Handles amount updates for feeding entries. */
  async function handleAmountSave(blockId: string, entryId: string, newAmount: number) {
    try {
      const updatedBlock = await BabyBootcampApi.updateFeedingAmount(newAmount, entryId);
      setFeedingBlocks(blocks =>
        blocks.map(block =>
          block.id === blockId ? updatedBlock : block
        )
      );

      const blocksAndEntries = await BabyBootcampApi.getUserBlocksWithEntries();
      setFeedingBlocks(blocksAndEntries);
    } catch (err) {
      console.error("Failed to update amount:", err);
    }
  }

  // *** Navigation for calendar ***

  /** Gets the start of the week (Sunday) for a given date. */
  function getStartOfWeek(date: DateTime): DateTime {
    return date.startOf('week');
  }

   /** Navigate to previous week */
  async function handlePreviousWeek() {
    const newDate = currentDate.minus({ weeks: 1 });
    setCurrentDate(newDate);

    try {
      const updatedBlocks = await BabyBootcampApi.getBlocksForWeek(
        newDate.startOf('week').toJSDate(),
      newDate.endOf('week').toJSDate()
      );
      setFeedingBlocks(updatedBlocks);
    } catch (err) {
      console.error("Error fetching entries for previous week:", err);
    }
  }

  /** Navigate to next week */
  async function handleNextWeek() {
    const newDate = currentDate.plus({ weeks: 1 });
    setCurrentDate(newDate);

    try {
      const updatedBlocks = await BabyBootcampApi.getBlocksForWeek(
        newDate.startOf('week').toJSDate(),
        newDate.endOf('week').toJSDate()
      );
      setFeedingBlocks(updatedBlocks);
    } catch (err) {
      console.error("Error fetching entries for new week:", err);
    }
  }

  const startOfWeek = getStartOfWeek(currentDate);
  const monthAndYear = startOfWeek.toFormat('MMMM yyyy');

  return (
    <div className='CalendarManager'>
      <button
        onClick={handlePreviousWeek}
        disabled={isSubmitting}
      >
        Previous week
      </button>
      <button
        onClick={handleNextWeek}
        disabled={isSubmitting}
      >
        Next week
      </button>
      <form onSubmit={handleAddBlock}>
        <button
          type='submit'
          disabled={isSubmitting}
        >
          Add a feeding block
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <CalendarView
        startOfWeek={startOfWeek}
        monthAndYear={monthAndYear}
        feedingBlocks={feedingBlocks}
        currentDate={currentDate}
        deleteFeedingBlock={handleDeleteBlock}
        onSetEliminationStart={handleSetEliminationStart}
        setToEliminate={setToEliminate}
        onTimeSave={handleTimeSave}
        onAmountSave={handleAmountSave}
      />
    </div>
  );
};

export default CalendarManager;