import { describe, it, expect } from 'vitest';
import BlockElimination from './blockElimination.js';

describe('BlockElimination - Feeding Algorithm Tests', () => {
  describe('Test #1: Only apply feeding algorithm to to-be-eliminating block', () => {
    it('applies volume reduction only to eliminating blocks', () => {
      const eliminatingBlock = {
        id: 'block-eliminating',
        number: 1,
        username: 'testuser',
        isEliminating: true,
        currentGroup: 0,
        eliminationStartDate: new Date('2025-10-28'),
        baselineVolume: 5.0
      };

      const entry = {
        id: 'entry-1',
        blockId: 'block-eliminating',
        feedingTime: new Date('2025-10-31'), // Day 3 - should reduce
        volumeInOunces: null,
        completed: false
      };

      // Should calculate reduced volume for eliminating block
      expect(BlockElimination.calculateVolume(entry, eliminatingBlock)).toBe(4.5);
    });

    it('returns null for non-eliminating blocks (volume is tracked, not calculated)', () => {
      const nonEliminatingBlock = {
        id: 'block-tracking',
        number: 2,
        username: 'testuser',
        isEliminating: false,
        currentGroup: 0,
        eliminationStartDate: null,
        baselineVolume: null
      };

      const entry = {
        id: 'entry-2',
        blockId: 'block-tracking',
        feedingTime: new Date('2025-10-31'),
        volumeInOunces: 3.0, // Manually entered, just tracking
        completed: false
      };

      // Should return null, letting the stored volumeInOunces be used as-is
      expect(BlockElimination.calculateVolume(entry, nonEliminatingBlock)).toBeNull();
    });
  });

  describe('Test #2: Every fourth day (3-day blocks), volume goes down by 0.5 ounces', () => {
    it('reduces volume every fourth day starting from baseline date', () => {
      const block = {
        id: 'block-1',
        number: 1,
        username: 'testuser',
        isEliminating: true,
        currentGroup: 0,
        eliminationStartDate: new Date('2025-10-28T23:00:00-04:00'), // Tuesday 11pm EDT
        baselineVolume: 5.0
      };

      const baseEntry = {
        id: 'entry-1',
        blockId: 'block-1',
        volumeInOunces: null,
        completed: false
      };

      // Days 0-2: 10/28, 10/29, 10/30 should all show 5 ounces
      const tue = { ...baseEntry, feedingTime: new Date('2025-10-28T23:00:00-04:00') };
      expect(BlockElimination.calculateVolume(tue, block)).toBe(5.0);

      const wed = { ...baseEntry, feedingTime: new Date('2025-10-29T23:00:00-04:00') };
      expect(BlockElimination.calculateVolume(wed, block)).toBe(5.0);

      const thu = { ...baseEntry, feedingTime: new Date('2025-10-30T23:00:00-04:00') };
      expect(BlockElimination.calculateVolume(thu, block)).toBe(5.0);

      // Day 3: 10/31 should be 4.5 oz (5.0 - 0.5)
      const fri = { ...baseEntry, feedingTime: new Date('2025-10-31T23:00:00-04:00') };
      expect(BlockElimination.calculateVolume(fri, block)).toBe(4.5);

      // Days 4-5 should also be 4.5 oz
      const sat = { ...baseEntry, feedingTime: new Date('2025-11-01T23:00:00-04:00') };
      expect(BlockElimination.calculateVolume(sat, block)).toBe(4.5);

      const sun = { ...baseEntry, feedingTime: new Date('2025-11-02T23:00:00-04:00') };
      expect(BlockElimination.calculateVolume(sun, block)).toBe(4.5);

      // Day 6: Should be 4.0 oz (5.0 - 1.0)
      const mon = { ...baseEntry, feedingTime: new Date('2025-11-03T23:00:00-04:00') };
      expect(BlockElimination.calculateVolume(mon, block)).toBe(4.0);
    });
  });

  describe('Test #3: Manual volume update becomes new baseline for remainder of 3-day block', () => {
    it('adjusts baseline when baby eats less during a 3-day block', () => {
      // Starting scenario: baseline 2.5oz, started on Sunday
      const block = {
        id: 'block-1',
        number: 2,
        username: 'testuser',
        isEliminating: true,
        currentGroup: 0,
        eliminationStartDate: new Date('2025-01-05'), // Sunday
        baselineVolume: 2.5
      };

      const baseEntry = {
        id: 'entry-1',
        blockId: 'block-1',
        volumeInOunces: null,
        completed: false
      };

      // First 3-day block (days 0-2): Sun/Mon/Tues should be 2.5oz
      const sun1 = { ...baseEntry, feedingTime: new Date('2025-01-05') };
      expect(BlockElimination.calculateVolume(sun1, block)).toBe(2.5);

      const mon1 = { ...baseEntry, feedingTime: new Date('2025-01-06') };
      expect(BlockElimination.calculateVolume(mon1, block)).toBe(2.5);

      const tue1 = { ...baseEntry, feedingTime: new Date('2025-01-07') };
      expect(BlockElimination.calculateVolume(tue1, block)).toBe(2.5);

      // Second 3-day block (days 3-5): Wed/Thurs/Fri should be 2.0oz (2.5 - 0.5)
      const wed1 = { ...baseEntry, feedingTime: new Date('2025-01-08') };
      expect(BlockElimination.calculateVolume(wed1, block)).toBe(2.0);

      const thu1 = { ...baseEntry, feedingTime: new Date('2025-01-09') };
      expect(BlockElimination.calculateVolume(thu1, block)).toBe(2.0);

      const fri1 = { ...baseEntry, feedingTime: new Date('2025-01-10') };
      expect(BlockElimination.calculateVolume(fri1, block)).toBe(2.0);

      // Third 3-day block (days 6-8): Sat/Sun/Mon should be 1.5oz (2.5 - 1.0)
      const sat1 = { ...baseEntry, feedingTime: new Date('2025-01-11') };
      expect(BlockElimination.calculateVolume(sat1, block)).toBe(1.5);

      const sun2 = { ...baseEntry, feedingTime: new Date('2025-01-12') };
      expect(BlockElimination.calculateVolume(sun2, block)).toBe(1.5);

      // SURPRISE: On Monday (day 8), baby only eats 1.0oz
      const mon2WithLowerVolume = {
        ...baseEntry,
        feedingTime: new Date('2025-01-13'),
        volumeInOunces: 1.0 // Baby ate less!
      };
      // Should respect the lower volume
      expect(BlockElimination.calculateVolume(mon2WithLowerVolume, block)).toBe(1.0);

      // Fourth 3-day block (days 9-11): Next reduction happens on Wednesday
      // It should go down by another 0.5oz from the NEW baseline of 2.5
      const wed2 = { ...baseEntry, feedingTime: new Date('2025-01-15') };
      expect(BlockElimination.calculateVolume(wed2, block)).toBe(1.0); // 2.5 - 1.5 = 1.0
    });

    it('maintains lower volume for remaining days in the same 3-day block', () => {
      const block = {
        id: 'block-1',
        number: 2,
        username: 'testuser',
        isEliminating: true,
        currentGroup: 2, // Currently in group 2 (days 6-8)
        eliminationStartDate: new Date('2025-01-05'),
        baselineVolume: 2.5
      };

      // Monday (day 8) - expected 1.5oz but baby only ate 1.0oz
      const mondayLower = {
        id: 'entry-mon',
        blockId: 'block-1',
        feedingTime: new Date('2025-01-13'),
        volumeInOunces: 1.0,
        completed: false
      };

      expect(BlockElimination.calculateVolume(mondayLower, block)).toBe(1.0);

      // Tuesday (day 9) should start next block and reduce by 0.5
      const tuesday = {
        id: 'entry-tue',
        blockId: 'block-1',
        feedingTime: new Date('2025-01-14'),
        volumeInOunces: null,
        completed: false
      };

      // Day 9 is in group 3, so: 2.5 - (3 * 0.5) = 1.0
      expect(BlockElimination.calculateVolume(tuesday, block)).toBe(1.0);
    });
  });

  describe('Test #4: Volume never goes below zero', () => {
    it('stops decreasing at 0', () => {
      const block = {
        id: 'block-1',
        number: 1,
        username: 'testuser',
        isEliminating: true,
        currentGroup: 0,
        eliminationStartDate: new Date('2025-01-01'),
        baselineVolume: 1.0
      };

      const baseEntry = {
        id: 'entry-1',
        blockId: 'block-1',
        volumeInOunces: null,
        completed: false
      };

      // Day 0-2: 1.0oz
      const day0 = { ...baseEntry, feedingTime: new Date('2025-01-01') };
      expect(BlockElimination.calculateVolume(day0, block)).toBe(1.0);

      // Day 3-5: 0.5oz (1.0 - 0.5)
      const day3 = { ...baseEntry, feedingTime: new Date('2025-01-04') };
      expect(BlockElimination.calculateVolume(day3, block)).toBe(0.5);

      // Day 6-8: 0oz (1.0 - 1.0, but never below 0)
      const day6 = { ...baseEntry, feedingTime: new Date('2025-01-07') };
      expect(BlockElimination.calculateVolume(day6, block)).toBe(0);

      // Day 9-11: Still 0oz (can't go negative)
      const day9 = { ...baseEntry, feedingTime: new Date('2025-01-10') };
      expect(BlockElimination.calculateVolume(day9, block)).toBe(0);

      // Day 20: Still 0oz
      const day20 = { ...baseEntry, feedingTime: new Date('2025-01-21') };
      expect(BlockElimination.calculateVolume(day20, block)).toBe(0);
    });

    it('handles baby stopping food intake (0 volume entered)', () => {
      const block = {
        id: 'block-1',
        number: 1,
        username: 'testuser',
        isEliminating: true,
        currentGroup: 0,
        eliminationStartDate: new Date('2025-01-05'),
        baselineVolume: 2.5
      };

      // Baby stops taking food
      const dayZero = {
        id: 'entry-1',
        blockId: 'block-1',
        feedingTime: new Date('2025-01-12'), // Day 7
        volumeInOunces: 0, // Baby stopped eating
        completed: false
      };

      expect(BlockElimination.calculateVolume(dayZero, block)).toBe(0);
    });
  });

  describe('getDaysBetween helper', () => {
    it('returns 0 for same date', () => {
      const date = new Date('2025-01-01');
      expect(BlockElimination.getDaysBetween(date, date)).toBe(0);
    });

    it('returns positive days for future dates', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-01-05');
      expect(BlockElimination.getDaysBetween(start, end)).toBe(4);
    });

    it('returns negative days for past dates', () => {
      const start = new Date('2025-01-05');
      const end = new Date('2025-01-01');
      expect(BlockElimination.getDaysBetween(start, end)).toBe(-4);
    });

    it('ignores time components', () => {
      const start = new Date('2025-01-01T08:30:00');
      const end = new Date('2025-01-01T20:45:00');
      expect(BlockElimination.getDaysBetween(start, end)).toBe(0);
    });

    it('handles timezone differences correctly', () => {
      const start = new Date('2025-10-28T23:00:00-04:00'); // EDT
      const end = new Date('2025-10-31T23:00:00-04:00'); // EDT
      expect(BlockElimination.getDaysBetween(start, end)).toBe(3);
    });
  });
});
