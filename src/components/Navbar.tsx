import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

interface Props {
  onLeaderboardClick: () => void;
}

export default function Navbar({ onLeaderboardClick }: Props) {
  return (
    <AppBar
      component={motion.div}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      elevation={0}
      position="sticky"
      sx={{
        top: 16,
        left: 0,
        right: 0,
        mx: "auto",
        width: "min(100%, 1200px)",
        background: "rgba(12, 20, 34, 0.86)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          mx: "auto",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 44,
              height: 44,
              borderRadius: "16px",
              background: "rgba(0, 230, 118, 0.16)",
            }}
          >
            <SportsSoccerRoundedIcon sx={{ color: "#00E676", fontSize: 26 }} />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 1.2 }}>
              Fantasy Football
            </Typography>
            <Typography variant="h6" fontWeight={800} letterSpacing={0.4}>
              Goal Guess
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={onLeaderboardClick}
          startIcon={<EmojiEventsRoundedIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            py: 1.25,
            fontWeight: 700,
            background: "linear-gradient(90deg, #00E676 0%, #00B8FF 100%)",
            color: "#000",
            boxShadow: "0 18px 40px rgba(0, 230, 118, 0.2)",
            '&:hover': {
              background: "linear-gradient(90deg, #00B8FF 0%, #00E676 100%)",
            },
          }}
          variant="contained"
        >
          Leaderboard
        </Button>
      </Toolbar>
    </AppBar>
  );
}
