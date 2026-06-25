import { useState, useMemo } from "react";
import { Box, Container, Typography, CircularProgress, Alert } from "@mui/material";

import Navbar from "./components/Navbar";
import MatchCard from "./components/MatchCard";
import LeaderboardDrawer from "./components/LeaderboardDrawer";
import { useUpcomingFifaMatches, useTeams } from "./hooks/useMatches";
import { enrichMatchesWithTeamData } from "./services/matchService";

export default function App() {
  const [open, setOpen] = useState(false);
  const { data: matches = [], isLoading: isLoadingMatches, error: matchesError } = useUpcomingFifaMatches();
  const { data: teams = [], isLoading: isLoadingTeams } = useTeams();

  // Enrich matches with team data (flags, logos)
  const enrichedMatches = useMemo(() => {
    if (matches.length > 0 && teams.length > 0) {
      return enrichMatchesWithTeamData(matches, teams);
    }
    return matches;
  }, [matches, teams]);

  const isLoading = isLoadingMatches || isLoadingTeams;
  const error = matchesError;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: { xs: 6, md: 8 },
        px: { xs: 2, md: 0 },
        background: "radial-gradient(circle at top, rgba(0,230,118,0.16), transparent 24%), radial-gradient(circle at 20% 10%, rgba(0,184,255,0.12), transparent 26%), linear-gradient(180deg, #040b14 0%, #07111d 100%)",
      }}
    >
      <Navbar onLeaderboardClick={() => setOpen(true)} />

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 2.5,
            mb: { xs: 4, md: 6 },
            pt: { xs: 1, md: 2 },
          }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ letterSpacing: "0.02em", maxWidth: 760 }}
          >
            Goal Guess — premium score predictions for every match.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 680, fontSize: { xs: 15, md: 16 } }}
          >
            Predict the score, challenge your friends, and climb a dynamic leaderboard built for fast, mobile-first decision making.
          </Typography>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#00E676" }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <Alert
              severity="error"
              sx={{ maxWidth: 600, borderRadius: 3 }}
            >
              <Typography fontWeight={700} mb={1}>
                Failed to Load Matches
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                {error.message || "Could not fetch FIFA World Cup matches. Please try again later."}
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Matches Grid */}
        {!isLoading && enrichedMatches && enrichedMatches.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(auto-fit, minmax(920px, 1fr))",
              },
              gap: 3,
              justifyItems: "center",
            }}
          >
            {enrichedMatches.map((match) => (
              <MatchCard
                key={match.id}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                homeLogo={match.homeLogo}
                awayLogo={match.awayLogo}
                kickoff={match.kickoff}
              />
            ))}
          </Box>
        ) : (
          !isLoading &&
          !error && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <Typography color="text.secondary" sx={{ fontSize: 16 }}>
                No upcoming matches available
              </Typography>
            </Box>
          )
        )}
      </Container>

      <LeaderboardDrawer open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
