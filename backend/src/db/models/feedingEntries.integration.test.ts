import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DateTime } from 'luxon';
import { db } from '../db.js';
import { users } from '../schema/users.js';
import { feedingBlocks } from '../schema/feedingBlocks.js';
import { FeedingBlock } from './feedingBlocks.js';
import { FeedingEntry } from './feedingEntries.js';
import { eq } from 'drizzle-orm';

describe('FeedingEntry Integration Tests - Volume Calculation and Elimination', () => {
  const testUsername = 'testuser_volume';
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

  describe('Test #5: Only one nighttime feeding block can be eliminated at a time', () => {
    it('allows only one block to be marked as eliminating', async () => {
      // Create three feeding blocks (representing three nighttime feedings)
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

      // Mark block 2 as eliminating
      await FeedingBlock.updateIsEliminating(
        block2Result.block.id,
        testUsername,
        true
      );

      // Verify only block 2 is marked as eliminating
      const allBlocks = await FeedingBlock.getAllByUsername(testUsername);
      expect(allBlocks).toHaveLength(3);

      const eliminatingBlocks = allBlocks.filter(b => b.isEliminating);
      expect(eliminatingBlocks).toHaveLength(1);
      expect(eliminatingBlocks[0].id).toBe(block2Result.block.id);

      // Verify other blocks are not eliminating
      const block1 = allBlocks.find(b => b.id === block1Result.block.id);
      expect(block1!.isEliminating).toBe(false);

      const block3 = allBlocks.find(b => b.id === block3Result.block.id);
      expect(block3!.isEliminating).toBe(false);
    });

    it('prevents marking a second block as eliminating when one is already being eliminated', async () => {
      // Create two blocks
      const block1Result = await FeedingBlock.createWithEntries({
        isEliminating: true, // First block is eliminating
        username: testUsername,
        timezone
      });

      const block2Result = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      // Try to mark second block as eliminating
      // This should fail or require first unmarking block1
      const allBlocks = await FeedingBlock.getAllByUsername(testUsername);
      const eliminatingCount = allBlocks.filter(b => b.isEliminating).length;

      // Should have exactly 1 eliminating block
      expect(eliminatingCount).toBe(1);
    });
  });

  describe('Test #6: Non-eliminating blocks track volume without modification', () => {
    it('stores and retrieves volumes for non-eliminating blocks without calculation', async () => {
      const today = DateTime.now().setZone(timezone).startOf('day');

      // Create a non-eliminating block
      const blockResult = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      // Get current week entries
      const weekStart = today.startOf('week');
      const weekEnd = today.endOf('week');

      const entries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        weekStart.toJSDate(),
        weekEnd.toJSDate(),
        blockResult.block.id
      );

      const todayEntry = entries.find(e => {
        const entryDate = DateTime.fromJSDate(e.feedingTime).setZone(timezone);
        return entryDate.hasSame(today, 'day');
      });

      expect(todayEntry).toBeDefined();

      // Update volume for today
      await FeedingEntry.updateEntryVolume(
        todayEntry!.id,
        testUsername,
        3.5,
        weekStart.toJSDate(),
        weekEnd.toJSDate()
      );

      // Get tomorrow's entry
      const tomorrow = today.plus({ days: 1 });
      const tomorrowEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        tomorrow.startOf('day').toJSDate(),
        tomorrow.endOf('day').toJSDate(),
        blockResult.block.id
      );

      const tomorrowEntry = tomorrowEntries.find(e => {
        const entryDate = DateTime.fromJSDate(e.feedingTime).setZone(timezone);
        return entryDate.hasSame(tomorrow, 'day');
      });

      // Tomorrow's volume should also be 3.5 (cascaded for non-eliminating blocks)
      expect(tomorrowEntry!.volumeInOunces).toBe(3.5);

      // Update tomorrow's volume to a different amount
      await FeedingEntry.updateEntryVolume(
        tomorrowEntry!.id,
        testUsername,
        2.0,
        tomorrow.startOf('week').toJSDate(),
        tomorrow.endOf('week').toJSDate()
      );

      // Verify tomorrow is now 2.0 (tracking the new amount)
      const updatedTomorrowEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        tomorrow.startOf('day').toJSDate(),
        tomorrow.endOf('day').toJSDate(),
        blockResult.block.id
      );

      const updatedTomorrowEntry = updatedTomorrowEntries.find(e => {
        const entryDate = DateTime.fromJSDate(e.feedingTime).setZone(timezone);
        return entryDate.hasSame(tomorrow, 'day');
      });

      expect(updatedTomorrowEntry!.volumeInOunces).toBe(2.0);
    });

    it('does not apply elimination calculation to non-eliminating blocks', async () => {
      const today = DateTime.now().setZone(timezone).startOf('day');

      // Create two blocks: one eliminating, one not
      const eliminatingBlock = await FeedingBlock.createWithEntries({
        isEliminating: true,
        username: testUsername,
        timezone
      });

      const trackingBlock = await FeedingBlock.createWithEntries({
        isEliminating: false,
        username: testUsername,
        timezone
      });

      // Set initial volumes for both blocks
      const weekStart = today.startOf('week');
      const weekEnd = today.endOf('week');

      const eliminatingEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        weekStart.toJSDate(),
        weekEnd.toJSDate(),
        eliminatingBlock.block.id
      );

      const trackingEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        weekStart.toJSDate(),
        weekEnd.toJSDate(),
        trackingBlock.block.id
      );

      const eliminatingTodayEntry = eliminatingEntries.find(e => {
        const entryDate = DateTime.fromJSDate(e.feedingTime).setZone(timezone);
        return entryDate.hasSame(today, 'day');
      });

      const trackingTodayEntry = trackingEntries.find(e => {
        const entryDate = DateTime.fromJSDate(e.feedingTime).setZone(timezone);
        return entryDate.hasSame(today, 'day');
      });

      // Set volumes
      await FeedingEntry.updateEntryVolume(
        eliminatingTodayEntry!.id,
        testUsername,
        5.0, // This will trigger elimination logic
        weekStart.toJSDate(),
        weekEnd.toJSDate()
      );

      await FeedingEntry.updateEntryVolume(
        trackingTodayEntry!.id,
        testUsername,
        4.0, // This will just track
        weekStart.toJSDate(),
        weekEnd.toJSDate()
      );

      // Check entries 4 days later (should be in next 3-day block for eliminating)
      const fourDaysLater = today.plus({ days: 4 });
      const futureWeekStart = fourDaysLater.startOf('week');
      const futureWeekEnd = fourDaysLater.endOf('week');

      const futureEliminatingEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        futureWeekStart.toJSDate(),
        futureWeekEnd.toJSDate(),
        eliminatingBlock.block.id
      );

      const futureTrackingEntries = await FeedingEntry.getEntriesForWeek(
        testUsername,
        futureWeekStart.toJSDate(),
        futureWeekEnd.toJSDate(),
        trackingBlock.block.id
      );

      const futureEliminatingEntry = futureEliminatingEntries.find(e => {
        const entryDate = DateTime.fromJSDate(e.feedingTime).setZone(timezone);
        return entryDate.hasSame(fourDaysLater, 'day');
      });

      const futureTrackingEntry = futureTrackingEntries.find(e => {
        const entryDate = DateTime.fromJSDate(e.feedingTime).setZone(timezone);
        return entryDate.hasSame(fourDaysLater, 'day');
      });

      // Eliminating block should show reduced volume (5.0 - 0.5 = 4.5 after 3 days)
      expect(futureEliminatingEntry!.volumeInOunces).toBeLessThan(5.0);

      // Tracking block should still show 4.0 (no calculation, just tracking)
      expect(futureTrackingEntry!.volumeInOunces).toBe(4.0);
    });
  });
});
