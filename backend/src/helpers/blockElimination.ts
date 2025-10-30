import { feedingBlocks } from '../db/schema/feedingBlocks.js';
import { feedingEntries } from '../db/schema/feedingEntries.js';

type FeedingBlockType = typeof feedingBlocks.$inferSelect;
type FeedingEntryType = typeof feedingEntries.$inferSelect;

/** Handles logic and ruleset for a block elimination. */
class BlockElimination {
  // TODO: Check benefits of global constants vs. private static
  static DECREMENT = 0.5;
  static GROUP_DAYS = 3;

  /**
   * Calculates the volume for a feeding entry based on elimination rules.
   * Returns null for non-eliminating blocks (volume should be tracked, not calculated).
   *
   * For eliminating blocks:
   * - Returns 0 for entries before elimination start date
   * - Uses baseline volume for first 3-day group (days 0-2)
   * - Reduces by 0.5oz every 3 days
   * - Respects manual overrides when baby eats less than expected
   * - Never goes below 0
   *
   * @param entry - The feeding entry
   * @param block - The feeding block
   * @returns The calculated volume, or null for non-eliminating blocks
   */
  static calculateVolume(entry: FeedingEntryType, block: FeedingBlockType): number | null {
    // Non-eliminating blocks: return null to use stored volume as-is
    if (!block.isEliminating) {
      return null;
    }

    // Eliminating block requires start date and baseline
    if (!block.eliminationStartDate || block.baselineVolume === null || block.baselineVolume === undefined) {
      return null;
    }

    // Calculate days since elimination started
    const daysSinceStart = this.getDaysBetween(block.eliminationStartDate, entry.feedingTime);

    // Entries before elimination start date return 0
    if (daysSinceStart < 0) {
      return 0;
    }

    // Calculate which 3-day group this entry belongs to
    const groupNumber = Math.floor(daysSinceStart / this.GROUP_DAYS);

    // Calculate expected volume based on baseline and group number
    const expectedVolume = Math.max(
      0,
      block.baselineVolume - (groupNumber * this.DECREMENT)
    );

    // If entry has a manually entered volume (override)
    if (entry.volumeInOunces !== null && entry.volumeInOunces !== undefined) {
      // Use the lower of expected or actual (baby might eat less)
      return Math.min(entry.volumeInOunces, expectedVolume);
    }

    // No manual override, use calculated volume
    return expectedVolume;
  }

  /**
   * Calculates the number of days between two dates, ignoring time components.
   *
   * @param start - Start date
   * @param end - End date
   * @returns Number of days between dates (can be negative if end is before start)
   */
  static getDaysBetween(start: Date, end: Date): number {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export default BlockElimination;