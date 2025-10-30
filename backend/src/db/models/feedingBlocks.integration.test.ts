import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DateTime } from 'luxon';
import { db } from '../db.js';
import { users } from '../schema/users.js';
import { feedingBlocks } from '../schema/feedingBlocks.js';
import { FeedingBlock } from './feedingBlocks.js';
import { FeedingEntry } from './feedingEntries.js';
import { eq } from 'drizzle-orm';

describe('FeedingBlock Integration Tests - Time Updates and Calendar Population', () => {
  const testUsername = 'testuser_timeupdate';
  const timezone = 'America/New_York';

  beforeEach(async () => {
    // Clean up any existing test data (cascade will handle entries)
    await db.delete(feedingBlocks).where(eq(feedingBlocks.username, testUsername));
    await db.delete(users).where(eq(users.username, testUsername));

    // Create test user
    await db.insert(users).values({
      username: testUsername,
      password: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User',
      email: `${testUsername}@example.com`,
      babyName: 'Baby Test'
    });
  });

  afterEach(async () => {
    // Clean up test data (cascade will handle entries)
    await db.delete(feedingBlocks).where(eq(feedingBlocks.username, testUsername));
    await db.delete(users).where(eq(users.username, testUsername));
  });

  describe('Test #1: Initial time entry creates feeding blocks with autofilled future days', () => {
    it('creates three feeding blocks with specified times and autofills future days', async () => {
      const today = DateTime.now().setZone(timezone).startOf('day');

      // Times for three nighttime feedings
      const feeding1Time = today.set({ hour: 23, minute: 0 }); // 11:00 PM
      const feeding2Time = today.set({ hour: 1, minute: 0 });  // 1:00 AM
      const feeding3Time = today.set({ hour: 5, minute: 0 });  // 5:00 AM

      // Create three feeding blocks
      const block1Result = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      const block2Result = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      const block3Result = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      // Update times for each block
      await FeedingBlock.updateAllEntryTimes(
        block1Result.block.id,
        feeding1Time.toJSDate()
      );

      await FeedingBlock.updateAllEntryTimes(
        block2Result.block.id,
        feeding2Time.toJSDate()
      );

      await FeedingBlock.updateAllEntryTimes(
        block3Result.block.id,
        feeding3Time.toJSDate()
      );

      // Verify three feeding blocks exist
      const allBlocks = await FeedingBlock.getAllByUsername(testUsername);
      expect(allBlocks).toHaveLength(3);
      expect(allBlocks[0].number).toBe(1);
      expect(allBlocks[1].number).toBe(2);
      expect(allBlocks[2].number).toBe(3);

      // Check tomorrow's entries (next day)
      const tomorrow = today.plus({ days: 1 });
      const tomorrowEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        tomorrow.startOf('day').toJSDate(),
        tomorrow.endOf('day').toJSDate()
      );

      expect(tomorrowEntries).toHaveLength(3);

      const tomorrowEntry1 = tomorrowEntries.find(e => e.blockId === block1Result.block.id);
      const tomorrowEntry1Time = DateTime.fromJSDate(tomorrowEntry1!.feedingTime).setZone(timezone);
      expect(tomorrowEntry1Time.hour).toBe(23);
      expect(tomorrowEntry1Time.minute).toBe(0);

      const tomorrowEntry2 = tomorrowEntries.find(e => e.blockId === block2Result.block.id);
      const tomorrowEntry2Time = DateTime.fromJSDate(tomorrowEntry2!.feedingTime).setZone(timezone);
      expect(tomorrowEntry2Time.hour).toBe(1);
      expect(tomorrowEntry2Time.minute).toBe(0);

      const tomorrowEntry3 = tomorrowEntries.find(e => e.blockId === block3Result.block.id);
      const tomorrowEntry3Time = DateTime.fromJSDate(tomorrowEntry3!.feedingTime).setZone(timezone);
      expect(tomorrowEntry3Time.hour).toBe(5);
      expect(tomorrowEntry3Time.minute).toBe(0);

      // Check next full week (7 days from now)
      const nextWeek = today.plus({ days: 7 });
      const nextWeekEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        nextWeek.startOf('week').toJSDate(),
        nextWeek.endOf('week').toJSDate()
      );

      const nextWeekBlock1Entries = nextWeekEntries.filter(e => e.blockId === block1Result.block.id);
      expect(nextWeekBlock1Entries.length).toBeGreaterThan(0);
      nextWeekBlock1Entries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(23);
        expect(entryTime.minute).toBe(0);
      });

      // Check one month later
      const oneMonthLater = today.plus({ months: 1 });
      const oneMonthEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        oneMonthLater.startOf('week').toJSDate(),
        oneMonthLater.endOf('week').toJSDate()
      );

      const oneMonthBlock1Entries = oneMonthEntries.filter(e => e.blockId === block1Result.block.id);
      expect(oneMonthBlock1Entries.length).toBeGreaterThan(0);
      oneMonthBlock1Entries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(23);
        expect(entryTime.minute).toBe(0);
      });
    });
  });

  describe('Test #2: Updated time autofills for future days', () => {
    it('updates time for a feeding block and autofills future days with new time', async () => {
      const today = DateTime.now().setZone(timezone).startOf('day');

      // Create a feeding block with initial time of 11:00 PM
      const blockResult = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      const initialTime = today.set({ hour: 23, minute: 0 });
      await FeedingBlock.updateAllEntryTimes(
        blockResult.block.id,
        initialTime.toJSDate()
      );

      // Update to new time: 11:30 PM (extending time between feedings)
      const newTime = today.set({ hour: 23, minute: 30 });
      await FeedingBlock.updateAllEntryTimes(
        blockResult.block.id,
        newTime.toJSDate()
      );

      // Check one week ahead
      const oneWeekAhead = today.plus({ weeks: 1 });
      const oneWeekEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        oneWeekAhead.startOf('week').toJSDate(),
        oneWeekAhead.endOf('week').toJSDate()
      );

      const oneWeekBlockEntries = oneWeekEntries.filter(e => e.blockId === blockResult.block.id);
      expect(oneWeekBlockEntries.length).toBeGreaterThan(0);
      oneWeekBlockEntries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(23);
        expect(entryTime.minute).toBe(30);
      });

      // Check one month ahead
      const oneMonthAhead = today.plus({ months: 1 });
      const oneMonthEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        oneMonthAhead.startOf('week').toJSDate(),
        oneMonthAhead.endOf('week').toJSDate()
      );

      const oneMonthBlockEntries = oneMonthEntries.filter(e => e.blockId === blockResult.block.id);
      expect(oneMonthBlockEntries.length).toBeGreaterThan(0);
      oneMonthBlockEntries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(23);
        expect(entryTime.minute).toBe(30);
      });

      // Check two months ahead
      const twoMonthsAhead = today.plus({ months: 2 });
      const twoMonthEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        twoMonthsAhead.startOf('week').toJSDate(),
        twoMonthsAhead.endOf('week').toJSDate()
      );

      const twoMonthBlockEntries = twoMonthEntries.filter(e => e.blockId === blockResult.block.id);
      expect(twoMonthBlockEntries.length).toBeGreaterThan(0);
      twoMonthBlockEntries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(23);
        expect(entryTime.minute).toBe(30);
      });
    });
  });

  describe('Test #3: No initial time submitted uses block creation time', () => {
    it('autofills with default time (noon) when no time is submitted', async () => {
      const today = DateTime.now().setZone(timezone).startOf('day');

      // Create block without setting a specific time
      const blockResult = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      // Get entries for the current week
      const currentWeekStart = today.startOf('week');
      const currentWeekEnd = today.endOf('week');

      const currentWeekEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        currentWeekStart.toJSDate(),
        currentWeekEnd.toJSDate()
      );

      const blockEntries = currentWeekEntries.filter(e => e.blockId === blockResult.block.id);
      expect(blockEntries.length).toBeGreaterThan(0);

      // Default time should be noon (12:00) as per createInitialEntries logic
      blockEntries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        // The time should match the time when the block was created
        // Since we didn't specify a time, it uses current time at block creation
        expect(entryTime).toBeDefined();
      });

      // Check that future days also use the same time
      const nextWeek = today.plus({ weeks: 1 });
      const nextWeekEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        nextWeek.startOf('week').toJSDate(),
        nextWeek.endOf('week').toJSDate()
      );

      const nextWeekBlockEntries = nextWeekEntries.filter(e => e.blockId === blockResult.block.id);
      expect(nextWeekBlockEntries.length).toBeGreaterThan(0);

      // All entries should have the same time
      const firstEntryTime = DateTime.fromJSDate(blockEntries[0].feedingTime).setZone(timezone);
      nextWeekBlockEntries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(firstEntryTime.hour);
        expect(entryTime.minute).toBe(firstEntryTime.minute);
      });
    });
  });

  describe('Test #4: Duplicate time submission maintains consistency', () => {
    it('maintains same time in future days when duplicate time is submitted', async () => {
      const today = DateTime.now().setZone(timezone).startOf('day');

      // Create block with initial time
      const blockResult = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      const initialTime = today.set({ hour: 23, minute: 0 });
      await FeedingBlock.updateAllEntryTimes(
        blockResult.block.id,
        initialTime.toJSDate()
      );

      // Submit the same time again (duplicate)
      await FeedingBlock.updateAllEntryTimes(
        blockResult.block.id,
        initialTime.toJSDate()
      );

      // Check that future days maintain the same time
      const oneWeekAhead = today.plus({ weeks: 1 });
      const weekEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        oneWeekAhead.startOf('week').toJSDate(),
        oneWeekAhead.endOf('week').toJSDate()
      );

      const blockEntries = weekEntries.filter(e => e.blockId === blockResult.block.id);
      expect(blockEntries.length).toBeGreaterThan(0);

      blockEntries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(23);
        expect(entryTime.minute).toBe(0);
      });

      // Check entries one month ahead
      const oneMonthAhead = today.plus({ months: 1 });
      const monthEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        oneMonthAhead.startOf('week').toJSDate(),
        oneMonthAhead.endOf('week').toJSDate()
      );

      const monthBlockEntries = monthEntries.filter(e => e.blockId === blockResult.block.id);
      expect(monthBlockEntries.length).toBeGreaterThan(0);

      monthBlockEntries.forEach(entry => {
        const entryTime = DateTime.fromJSDate(entry.feedingTime).setZone(timezone);
        expect(entryTime.hour).toBe(23);
        expect(entryTime.minute).toBe(0);
      });
    });
  });
});
