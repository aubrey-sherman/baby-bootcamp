type tFeedingEntry = {
  id: string,
  username: string,
  eventTime: Date,
  volumeInOunces: number,
  eliminating: boolean,
};

type tRegisterParams = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

type tCurrentUser = {
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  feedingEntries: tFeedingEntry[]
};

type tLoginParams = {
  username: string;
  password: string;
}

type tLogIn = {
  logIn: ({ username, password }: tLoginParams) => Promise<void>;
}

type tSignUp = {
  signUp: (
    { username, password, firstName, lastName, email }: tRegisterParams) => Promise<void>;
}

type tRoutesProps = {
  currentUser: tCurrentUser;
  signUp: tSignUp;
  logIn: tLogIn;
}

export type {
  tFeedingEntry,
  tRegisterParams,
  tCurrentUser,
  tSignUp,
  tLoginParams,
  tLogIn,
  tRoutesProps
};