/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import type { Match } from "../types/Leaderboard";

export interface Prediction {
  username: string;
  matchId: string;
  prediction: {
    team1: number;
    team2: number;
    penaltyWinner: string | null;
  };
  score: number | null;
}

export default function usePredictions(
  matches: Match[],
  username: string | null,
) {
  const [predictions, setPredictions] = useState<
    Record<
      string,
      {
        home: number;
        away: number;
        penaltyWinner: string | null;
      }
    >
  >({});
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  //-----------------------------------------------------------------------
  // Load existing predictions
  //-----------------------------------------------------------------------

  const loadPredictions = useCallback(async () => {
    if (!username) return;

    setLoadingPredictions(true);

    try {
      const scoreMap: Record<
        string,
        { home: number; away: number; penaltyWinner: string | null }
      > = {};

      const submitted = new Set<string>();

      await Promise.all(
        matches.map(async (match) => {
          if (!match.id) return;

          const docId = `${username.toLowerCase()}_${match.id}`;

          const snap = await getDoc(doc(db, "predictions", docId));

          if (!snap.exists()) return;

          const prediction = snap.data() as Prediction;

          scoreMap[match.id] = {
            home: prediction.prediction.team1,
            away: prediction.prediction.team2,
            penaltyWinner: prediction.prediction.penaltyWinner ?? null,
          };

          submitted.add(match.id);
        }),
      );

      setPredictions(scoreMap);
      setSubmittedIds(submitted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPredictions(false);
    }
  }, [matches, username]);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions, refreshKey]);

  //-----------------------------------------------------------------------
  // Update local prediction
  //-----------------------------------------------------------------------

  const updatePrediction = useCallback(
    (
      matchId: string,
      field: "home" | "away" | "penaltyWinner",
      value: number | string | null,
    ) => {
      if (submittedIds.has(matchId)) return;

      setPredictions((prev) => {
        const existing = prev[matchId] ?? {
          home: 0,
          away: 0,
          penaltyWinner: null,
        };

        const updated = {
          ...existing,
          [field]: value,
        };

        // If it's no longer a draw, clear penalty winner
        if (updated.home !== updated.away) {
          updated.penaltyWinner = null;
        }

        return {
          ...prev,
          [matchId]: updated,
        };
      });
    },
    [submittedIds],
  );

  //-----------------------------------------------------------------------
  // Save prediction
  //-----------------------------------------------------------------------
  const savePrediction = async (match: Match) => {
    console.log("========== SAVE START ==========");

    console.log("match", match);
    console.log("username", username);
    console.log("predictions", predictions);

    if (!match.id) {
      console.error("No match id");
      return;
    }

    if (!username) {
      console.error("No username");
      return;
    }

    const prediction = predictions[match.id];

    if (prediction.home === prediction.away && !prediction.penaltyWinner) {
      alert("Please select a penalty winner.");
      return;
    }

    console.log("prediction", prediction);

    if (!prediction) {
      console.error("Prediction not found");
      return;
    }

    const documentId = `${username.toLowerCase()}_${match.id}`;

    console.log("Document ID", documentId);

    const payload = {
      username,
      matchId: match.id,
      prediction: {
        team1: prediction.home,
        team2: prediction.away,
        penaltyWinner:
          prediction.home === prediction.away ? prediction.penaltyWinner : null,
      },
      score: null,
    };

    console.log("Payload", payload);

    try {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.add(match.id!);
        return next;
      });
      await setDoc(doc(db, "predictions", documentId), payload);

      console.log("Firestore write successful");

      setSubmittedIds((prev) => {
        const next = new Set(prev);
        next.add(match.id!);
        return next;
      });
    } catch (e) {
      console.error("Firestore error", e);
      alert(JSON.stringify(e));
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(match.id!);
        return next;
      });
    }
  };
  //-----------------------------------------------------------------------
  // Reset prediction
  //-----------------------------------------------------------------------

  const resetPrediction = useCallback(
    (matchId: string) => {
      if (submittedIds.has(matchId)) return;

      setPredictions((prev) => {
        const copy = { ...prev };
        delete copy[matchId];
        return copy;
      });

      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[matchId];
        return copy;
      });
    },
    [submittedIds],
  );

  //-----------------------------------------------------------------------
  // Load everyone else's predictions
  //-----------------------------------------------------------------------

  const loadPredictionsForMatch = useCallback(
    async (matchId: string): Promise<Prediction[]> => {
      const q = query(
        collection(db, "predictions"),
        where("matchId", "==", matchId),
      );

      const snapshot = await getDocs(q);

      const results: Prediction[] = [];

      snapshot.forEach((doc) => {
        results.push(doc.data() as Prediction);
      });

      results.sort((a, b) => {
        if (a.username === username) return -1;

        if (b.username === username) return 1;

        return a.username.localeCompare(b.username);
      });

      return results;
    },
    [username],
  );

  const revokePrediction = async (match: Match) => {
    if (!username || !match.id) return;

    const documentId = `${username.toLowerCase()}_${match.id}`;

    await deleteDoc(doc(db, "predictions", documentId));

    setSubmittedIds((prev) => {
      const next = new Set(prev);
      next.delete(match.id!);
      return next;
    });

    setPredictions((prev) => {
      const copy = { ...prev };
      delete copy[match.id!];
      return copy;
    });
  };

  //-----------------------------------------------------------------------

  const reload = () => setRefreshKey((k) => k + 1);

  return {
    predictions,
    submittedIds,
    errors,
    loadingPredictions,
    updatePrediction,
    savePrediction,
    resetPrediction,
    loadPredictionsForMatch,
    savingIds,
    reload,
    revokePrediction
  };
}
