type FeedingEntry = {
  id: string,
  username: string,
  eventTime: Date,
  volumeInOunces: number,
  eliminating: boolean,
};

type RegisterParams = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  babyName: string;
}

type UserData = {
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  babyName: string,
  feedingEntries: FeedingEntry[]
} | null;

type CurrentUser = {
  data: UserData | null;
  infoLoaded: boolean;
};

type LoginParams = {
  username: string;
  password: string;
}

type LogIn = {
  logIn: ({ username, password }: LoginParams) => Promise<void>;
}

type SignUp = {
  signUp: (
    { username, password, firstName, lastName, email }: RegisterParams) => Promise<void>;
}

type LogOut = {
  logOut: () => void;
}

type FeedingBlock = {
  id: string;
  number: number;
}

interface NavigationProps {
  currentUser: UserData;
  logOut: LogOut;
}

interface RoutesProps {
  currentUser: UserData;
  signUp: SignUp;
  logIn: LogIn;
}

interface HomeProps {
  currentUser: UserData;
}

export type {
  FeedingEntry,
  RegisterParams,
  UserData,
  CurrentUser,
  SignUp,
  LoginParams,
  LogIn,
  RoutesProps,
  HomeProps,
  NavigationProps,
  FeedingBlock
};