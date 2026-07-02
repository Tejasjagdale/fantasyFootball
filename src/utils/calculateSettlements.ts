/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

type Summary = {
  matchesProcessed: number;
  usersUpdated: number;
};

export async function calculateSettlements(entryFee: number): Promise<Summary> {
  const batch = writeBatch(db);

  const usersSnap = await getDocs(collection(db, "users"));
  const matchesSnap = await getDocs(
    query(collection(db, "matches"), where("status", "==", "completed"))
  );

  // Yesterday range
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);

  // username -> amount
  const amountMap = new Map<string, number>();

  // username -> user doc ref
  const userDocMap = new Map<string, any>();

  usersSnap.forEach((d) => {
    const data: any = d.data();
    amountMap.set(data.username.toLowerCase(), 0);
    userDocMap.set(data.username.toLowerCase(), d.ref);
  });

  let processed = 0;

  for (const matchDoc of matchesSnap.docs) {
    const match: any = matchDoc.data();

    if (!match.createdOn) continue;

    const created = match.createdOn.toDate();

    if (created < startYesterday || created >= startToday) continue;

    processed++;

    const predSnap = await getDocs(
      query(
        collection(db, "predictions"),
        where("matchId", "==", matchDoc.id)
      )
    );

    const predictions = predSnap.docs.map((d) => d.data() as any);

    if (predictions.length === 0) continue;

    const highest = Math.max(...predictions.map((p) => p.score ?? 0));

    if (highest < 2) continue;

    const winners = predictions.filter((p) => (p.score ?? 0) === highest);
    const losers = predictions.filter((p) => (p.score ?? 0) !== highest);

    const winnerAmount =
      winners.length === 0
        ? 0
        : (losers.length * entryFee) / winners.length;

    for (const w of winners) {
      const key = w.username.toLowerCase();
      amountMap.set(key, (amountMap.get(key) ?? 0) + winnerAmount);
    }

    for (const l of losers) {
      const key = l.username.toLowerCase();
      amountMap.set(key, (amountMap.get(key) ?? 0) - entryFee);
    }
  }

  let usersUpdated = 0;

  for (const [username, amount] of amountMap.entries()) {
    const ref = userDocMap.get(username);
    if (!ref) continue;

    batch.update(ref, {
      pendingAmount: amount,
      lastSettledOn: null,
    });

    usersUpdated++;
  }

  await batch.commit();

  return {
    matchesProcessed: processed,
    usersUpdated,
  };
}
