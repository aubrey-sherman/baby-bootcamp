import { DateTime } from 'luxon';


/** Methods related to handling timezone logic between UTC and local. */
class TimezoneHandler {
  constructor(
    private userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) {}

  /** Gets the user's current timezone
   * Used when sending timezone to the backend in headers
   */
  getCurrentUserTimezone(): string {
    return this.userTimezone;
  }

  /** Formats a date for display in the UI */
  formatForDisplay(date: Date, format?: string): string {
    if (format) {
      return DateTime.fromJSDate(date)
        .setZone(this.userTimezone)
        .toFormat(format);
    }
    // Default readable format
    return DateTime.fromJSDate(date)
      .setZone(this.userTimezone)
      .toLocaleString(DateTime.DATETIME_SHORT);
  }

  /** Safely parses a date/time value that could be string, Date, or null
 * and converts to DateTime in the user's timezone
 */
  parseToUserTimezone(dateValue: string | Date | null): DateTime {
    if (!dateValue) {
      return DateTime.now().setZone(this.getCurrentUserTimezone());
    }
    return typeof dateValue === 'string'
      ? DateTime.fromISO(dateValue).setZone(this.getCurrentUserTimezone())
      : DateTime.fromJSDate(dateValue).setZone(this.getCurrentUserTimezone());
  }

  /**
   * Prepares a date for API requests by converting to ISO string in user's timezone.
   * Ensures consistent format when sending dates to backend
   * Throws an error if the date cannot be formatted or is invalid
   */
  prepareDateForApi(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided to prepareDateForApi');
    }

    const formatted = DateTime.fromJSDate(date)
      .setZone(this.userTimezone)
      .toISO();

    if (!formatted) {
      throw new Error(`Failed to format date ${date} for API in timezone ${this.userTimezone}`);
    }

    return formatted;
  }

  /**
   * Gets array of dates for a week, starting from given date
   * Used for calendar view generation
   * @param currentDate - Date to get week for
   */
  getWeekDates(currentDate: Date): Date[] {
    const start = DateTime.fromJSDate(currentDate)
      .setZone(this.userTimezone)
      .startOf('week');

    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(
        start.plus({ days: i }).toJSDate()
      );
    }
    return dates;
  }

  /**
   * Gets start of week for a given date
   * Used for API requests and calendar navigation
   */
  getWeekStart(date: Date): Date {
    return DateTime.fromJSDate(date)
      .setZone(this.userTimezone)
      .startOf('week')
      .toJSDate();
  }

  // NOTE: This method is useful for navigating backwards in a calendar, e.g.
  // for a 'Previous week' button
  /**
   * Adds weeks to a date
   * Used for calendar navigation
   * @param date - Starting date
   * @param weeks - Number of weeks to add (negative for subtraction)
   */
  addWeeks(date: Date, weeks: number): Date {
    return DateTime.fromJSDate(date)
      .setZone(this.userTimezone)
      .plus({ weeks })
      .toJSDate();
  }

  /**
   * Checks if two dates are the same day in user's timezone
   * Used for highlighting current day, comparing dates
   */
  isSameDay(date1: Date, date2: Date): boolean {
    const d1 = DateTime.fromJSDate(date1).setZone(this.userTimezone);
    const d2 = DateTime.fromJSDate(date2).setZone(this.userTimezone);
    return d1.hasSame(d2, 'day');
  }
}

export default TimezoneHandler;