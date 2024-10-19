// FIXME: add VITE_REACT... value in env
const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL || 'http://localhost:3001';

import { RegisterParams, LoginParams } from '../types.ts';

/** API class with static methods for getting and sending to the API. */

class BabyBootcampApi {

  // this will hold the authenticated user's JWT
  static token: string;

  static async request(endpoint, data = {}, method = "GET") {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    const headers = {
      authorization: `Bearer ${BabyBootcampApi.token}`,
      'content-type': 'application/json',
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
      console.error("API Error:", resp.statusText, resp.status);
      const message = (await resp.json()).error.message;
      throw Array.isArray(message) ? message : [message];
    }

    return await resp.json();
  }

  // Individual API routes

  /** Get the current user. */
  static async getCurrentUser(username: string) {
    let res = await this.request(`users/${username}`);

    console.log("getCurrentUser user=", res.user)
    return res.user;
  }

  /** Get current user's feeding entries by username. */
  static async userEntries(username: string) {
    let res = await this.request(`feeding-entries/${username}`)
    return res.userEntries;
  }

  /** Create a new feeding entry. */

  /** Update an existing feeding entry. */

  /**  Register a user with data from sign up form. Returns a token on success. */
  static async registerUser(userData: RegisterParams) {
    console.debug("Frontend registerUser running")
    let res = await this.request('auth/register', userData, "POST");

    console.debug("res=", res)
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