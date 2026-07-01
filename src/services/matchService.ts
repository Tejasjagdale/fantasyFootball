import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Match } from "../types/Leaderboard";


const matchesRef = query(
  collection(db, "matches"),
  orderBy("createdOn", "desc")
);

export async function createMatch(
  team1: string,
  team2: string
) {
  await addDoc(collection(db, "matches"), {
    team1,
    team2,
    status: "upcoming",
    createdOn: serverTimestamp(),
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
  team2Score: number,
  penaltyWinner: string | null
) {
  await updateDoc(doc(db, "matches", id), {
    status: "completed",
    result: {
      team1: team1Score,
      team2: team2Score,
      penaltyWinner,
    },
  });
}

export async function updateMatchStatus(
  id: string,
  status: "upcoming" | "locked" | "completed"
) {
  await updateDoc(doc(db, "matches", id), {
    status,
  });
}