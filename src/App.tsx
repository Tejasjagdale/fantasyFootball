import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";

import Navbar from "./components/Navbar";
import MatchCard from "./components/MatchCard";
import LeaderboardDrawer from "./components/LeaderboardDrawer";

export default function App() {
  const [open, setOpen] = useState(false);

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

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <MatchCard
            homeTeam="Real Madrid"
            awayTeam="Manchester City"
            kickoff="Today • 9:30 PM"
            homeLogo="https://media.api-sports.io/football/teams/541.png"
            awayLogo="https://media.api-sports.io/football/teams/50.png"
          />
        </Box>
      </Container>

      <LeaderboardDrawer open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}