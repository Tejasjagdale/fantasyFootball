import type { Timestamp } from "firebase/firestore";

export interface LeaderboardUser {
  username: string;
  points: number;
  exact: number;
}

export type User = {
  id: string;
  username: string;
  role: "user" | "admin" | "superadmin";
  lastSeen?: Timestamp;
};

export type Match = {
  id: string;
  team1: string;
  team2: string;
  status: string;
  createdOn?: Timestamp;
  result: {
    team1: number;
    team2: number;
    penaltyWinner: string | null;
  } | null;
};
