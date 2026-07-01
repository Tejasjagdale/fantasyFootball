/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import {
  Box, CircularProgress, Container, Typography, ToggleButton,
  ToggleButtonGroup,
  Badge,
} from "@mui/material";

import Navbar from "../components/Navbar";
import LeaderboardDrawer from "../components/LeaderboardDrawer";
import MatchPredictionCard from "../components/MatchPredictionCard";
import PredictionDialog from "../components/PredictionDialog";

import { subscribeToMatches } from "../services/matchService";

import usePredictions from "../hooks/usePredictions";
import { useNavigate } from "react-router-dom";
import GameRulesFab from "../components/GameRulesFab";
import type { Match } from "../types/Leaderboard";


export default function HomePage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<"fixtures" | "results">("fixtures");
  const [dialogLoading, setDialogLoading] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [dialogPredictions, setDialogPredictions] = useState<any>([]);


  useEffect(() => {
    const unsubscribe = subscribeToMatches((items) => {
      setMatches(items);

      setLoadingMatches(false);
    });
    

    return () => unsubscribe();
  }, []);


  const {
    predictions,
    submittedIds,
    savingIds,
    updatePrediction,
    savePrediction,
    loadPredictionsForMatch,
    revokePrediction
  } = usePredictions(matches, username);

  //------------------------------------------------------------------
  // Dialog
  //------------------------------------------------------------------

  const openPredictionDialog = async (match: Match) => {
    if (!match.id) return;

    setSelectedMatch(match);

    setDialogOpen(true);

    setDialogLoading(true);

    try {
      const data = await loadPredictionsForMatch(match.id);

      setDialogPredictions(data);
    } finally {
      setDialogLoading(false);
    }
  };


  const onLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login")
  }

  const fixtureMatches = matches.filter(
    (m) => m.status !== "completed"
  );

  const completedMatches = matches.filter(
    (m) => m.status === "completed"
  );

  const visibleMatches =
    view === "fixtures"
      ? fixtureMatches
      : completedMatches;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 8,
        background:
          "radial-gradient(circle at top, rgba(0,230,118,.15), transparent 25%), linear-gradient(180deg,#04101b,#08131f)",
      }}
    >
      <Navbar onLeaderboardClick={() => setLeaderboardOpen(true)}
        username={username ?? ""} onLogout={onLogout} />

      <Container
        maxWidth="lg"
        sx={{
          mt: 5,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          color="white"
        >
          FIFA Prediction League
        </Typography>

        <Typography
          mt={1}
          mb={5}
          textAlign="center"
          color="rgba(255,255,255,.55)"
        >
          Predict every match before kickoff.
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          mb={5}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, value) => {
              if (value) setView(value);
            }}
            sx={{
              background: "rgba(255,255,255,.05)",
              borderRadius: 3,
              p: .5,
            }}
          >
            <ToggleButton
              value="fixtures"
              sx={{
                px: 4,
                textTransform: "none",
              }}
            >
              ⚽ Fixtures
              <Badge
                color="primary"
                badgeContent={fixtureMatches.length}
                sx={{ ml: 2 }}
              />
            </ToggleButton>

            <ToggleButton
              value="results"
              sx={{
                px: 4,
                textTransform: "none",
              }}
            >
              🏆 Results
              <Badge
                color="success"
                badgeContent={completedMatches.length}
                sx={{ ml: 2 }}
              />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loadingMatches && (
          <Box py={8} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}

        {!loadingMatches && matches.length === 0 && (
          <Typography textAlign="center">No matches available.</Typography>
        )}

        <Box display="grid" gap={4} justifyItems="center">
          {visibleMatches.map((match) => {
            if (!match.id) return null;

            const id = match.id;

            return (
              <MatchPredictionCard
                key={id}
                match={match}
                prediction={predictions[id]}
                saving={savingIds.has(id)}
                submitted={submittedIds.has(id)}
                onHomeScoreChange={(score) =>
                  updatePrediction(id, "home", score)
                }
                onAwayScoreChange={(score) =>
                  updatePrediction(id, "away", score)
                }
                onPenaltyWinnerChange={(winner) =>
                  updatePrediction(id, "penaltyWinner", winner)
                }
                onRevokePrediction={() =>
                  revokePrediction(match)
                }
                onSubmit={() => savePrediction(match)}
                onViewPredictions={() => openPredictionDialog(match)}
              />
            );
          })}
        </Box>
      </Container>

      <PredictionDialog
        open={dialogOpen}
        match={selectedMatch}
        loading={dialogLoading}
        predictions={dialogPredictions}
        username={username ?? ""}
        onClose={() => setDialogOpen(false)}
      />

      <LeaderboardDrawer
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
      <GameRulesFab />
    </Box>
  );
}
