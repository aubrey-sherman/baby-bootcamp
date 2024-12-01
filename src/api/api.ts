// FIXME: add VITE_REACT... value in env
const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL || 'http://localhost:3001';

import { DateTime } from 'luxon';
import TimezoneHandler from '../helpers/TimezoneHandler.ts';
import { RegisterParams, LoginParams, FeedingBlock } from '../types.ts';

/** API class with static methods for getting and sending to the API. */

class BabyBootcampApi {

  // this will hold the authenticated user's JWT
  static token: string;
  private static tzHandler = new TimezoneHandler();

  static async request(
    endpoint: string,
    data = {},
    method = "GET",
  ) {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    const timezone = this.tzHandler.getCurrentUserTimezone().toString();

    const headers = {
      authorization: `Bearer ${BabyBootcampApi.token}`,
      'content-type': 'application/json',
      'x-user-timezone': timezone
    };

    url.search = (method === "GET")
      ? new URLSearchParams(data).toString()
      : "";

    // set to undefined since the body property cannot exist on a GET method
    const body = (method !== "GET")
      ? JSON.stringify(data)
      : undefined;

    const resp = await fetch(url, { method, body, headers });

    if (!resp.ok) {
      const message = (await resp.json()).error.message;
      throw Array.isArray(message) ? message : [message];
    }

    return await resp.json();
  }

  // Individual API routes

  /** Get the current user.
   *
   * If successful, returns {
   *                         username: fetchedUser.username,
   *                         firstName: fetchedUser.firstName,
   *                         lastName: fetchedUser.lastName,
   *                         email: fetchedUser.email,
   *                         babyName: fetchedUser.babyName,
   *                        }
   *
      Throws error otherwise.
  */
  static async getCurrentUser(username: string) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get current user's feeding blocks, ordered by number.
   *
   * Returns sorted array of feeding blocks, where a feeding block is:
   *    {
   *      number: number,
   *      id: string,
   *      isEliminating: boolean,
   *      username: string,
   *      feedingEntries[]
   *     }
   *
   * Returns an empty array if no blocks exist.
  */
  static async getUserBlocksWithEntries() {
    let response = await this.request(`feeding-routes/blocks/entries`)

    return response.blocks.sort(
      (a: FeedingBlock, b: FeedingBlock) => a.number - b.number);
  }

  /** Get blocks with their entries for a specific week.
  *
  * Returns array of blocks, each with their filtered entries for the week.
  * Creates entries if they don't exist, using time pattern from previous entries.
  */
  static async getBlocksForWeek(weekStart: Date, weekEnd: Date): Promise<FeedingBlock[]> {
    const response = await this.request(
      'feeding-routes/blocks/entries',
      {
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString()
      },
      'GET',
    );

    return response.blocks;
  }

  /** Sets isEliminating value to true for a specified block. */
  static async updateIsEliminating(isEliminating: boolean = true, blockId: string) {
    const response = await this.request(
      `feeding-routes/blocks/${blockId}`,
      { isEliminating },
      "PATCH"
    );

    return {
      ...response.block,
      feedingEntries: response.block.feedingEntries
    }
  }

  /** Create a new feeding block with initial entries.
   *
   * Returns new block with its entries
  */
  static async createBlockWithEntries(isEliminating: boolean = false) {
    const response = await this.request(
      `feeding-routes/blocks`,
      { isEliminating },
      "POST"
    );

    return {
      ...response.block,
      feedingEntries: response.entries
    }
  }

  /** Delete a feeding block. Backend handles resequencing.
   *
   * Returns id of deleted block.
   */
  static async deleteBlock(id: string): Promise<string> {
    const response = await this.request(`feeding-routes/blocks/${id}`, {}, "DELETE");
    return response.deleted;
  }

  /** Updates time for current and all feeding entries in a block.
   *
   * Returns block with updated feeding entries as { block: feedingEntry[]}
   */
  static async updateTime(blockId: string, newTime: DateTime): Promise<FeedingBlock> {
    const formattedTime = this.tzHandler.prepareDateForApi(newTime.toJSDate());

    const response = await this.request(
      `feeding-routes/blocks/${blockId}/feeding-time`,
      { feedingTime: formattedTime },
      "PATCH"
    )

    return {
      ...response.block,
      feedingEntries: response.block.feedingEntries
    };
  }

  /** Sets a given date as the starting point for block elimination logic.
   *
   * Returns the updated block.
   */
  /** Sets start date for elimination of a feeding block */
  static async setStartDateForElimination(
    baselineVolume: number,
    blockId: string,
    startDate: DateTime) {

    const formattedTime = this.tzHandler.prepareDateForApi(startDate.toJSDate());

    const response = await this.request(
      `feeding-routes/blocks/${blockId}/elimination`,
      { startDate: formattedTime, baselineVolume},
      "POST"
    );

    return {
      ...response.block,
      feedingEntries: response.block.feedingEntries
    };
  }

  /** Saves feeding amount.
   *
   * For non-eliminating blocks, updated volume will apply to current and subsequent entries.
   * For eliminating block, volume becomes the new baseline for elimination logic.
   *
   * Returns the updated block with entries for the current week.
   */
  static async updateFeedingAmount(volumeInOunces: number, entryId: string) {
    let response = await this.request(
      `feeding-routes/entries/${entryId}/volume`,
      { volumeInOunces },
      "PATCH"
    );

    return {
      ...response.block,
      feedingEntries: response.block.feedingEntries
    };
  }

  /**  Register a user with data from sign up form. Returns a token on success. */
  static async registerUser(userData: RegisterParams) {
    let res = await this.request('auth/register', userData, "POST");
    return res.token;
  }

  // FIXME: Make sure documentation is accurate for error handling.
   /** Logs in a user with a valid username and password.
   *
   *  For an authenticated username and password, returns a token.
   *
   *  For failed authentication, returns error object =>
   *      { error: message, status}
   */
   static async logInUser({ username, password }: LoginParams) {
    let res = await this.request('auth/token', {
      username,
      password
    },
      "POST");

    this.token = res.token;
    return this.token;
  }
}

export default BabyBootcampApi;