type tFeedingEntry = {
  id: string,
  userId: string,
  eventTime: Date,
  measurement: number,
  // FIXME: update block data type in sequelize to a num; how to handle variable nums?
  block: number,
  timezone: string
};

type tCurrentUser = {
  username: string,
  firstName: string,
  lastName: string,
  isAdmin: boolean,
  email: string,
  feedingEntries: tFeedingEntry[]
};

export type { tFeedingEntry, tCurrentUser };