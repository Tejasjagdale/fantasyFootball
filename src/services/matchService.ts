import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface Match {
  id?: string;
  team1: string;
  team2: string;
  status: string;
  result: {
    team1: number;
    team2: number;
    penaltyWinner: string | null;
  } | null;
}

const matchesRef = collection(db, "matches");

export async function createMatch(team1: string, team2: string) {
  await addDoc(matchesRef, {
    team1,
    team2,
    status: "UPCOMING",
    result: null,
  });
}

export async function getMatches(): Promise<Match[]> {
  const snapshot = await getDocs(matchesRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Match, "id">),
  }));
}

export function subscribeToMatches(
  callback: (matches: Match[]) => void
) {
  return onSnapshot(matchesRef, (snapshot) => {
    const matches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Match, "id">),
    }));

    callback(matches);
  });
}

export async function updateMatch(
  id: string,
  team1: string,
  team2: string
) {
  await updateDoc(doc(db, "matches", id), {
    team1,
    team2,
  });
}

export async function declareResult(
  id: string,
  team1Score: number,
  team2Score: number
) {
  await updateDoc(doc(db, "matches", id), {
    status: "COMPLETED",
    result: {
      team1: team1Score,
      team2: team2Score,
    },
  });
}