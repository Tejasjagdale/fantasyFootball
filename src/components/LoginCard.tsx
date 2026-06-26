import { useState } from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SportsScoreRoundedIcon from "@mui/icons-material/SportsScoreRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import GlassCard from "./GlassCard";

type Props = {
  onLogin: (username: string) => void;
};

export default function LoginCard({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const value = username.trim().toLowerCase();

    if (!value || loading) return;

    setLoading(true);

    await onLogin(value);

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        type: "spring",
      }}
    >
      <GlassCard
        sx={{
          width: 430,
          backdropFilter: "blur(24px)",
          background:
            "linear-gradient(145deg,rgba(26,35,50,.95),rgba(11,18,31,.95))",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <Stack spacing={3.5} alignItems="center">
          {/* Floating Football */}

          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "linear",
            }}
          >
            <Avatar
              sx={{
                width: 95,
                height: 95,
                bgcolor: "rgba(0,230,118,.12)",
                border: "2px solid rgba(0,230,118,.35)",
                boxShadow: "0 0 35px rgba(0,230,118,.45)",
              }}
            >
              <SportsSoccerRoundedIcon
                sx={{
                  fontSize: 56,
                  color: "#00E676",
                }}
              />
            </Avatar>
          </motion.div>

          <Stack spacing={1} alignItems="center">
            <Typography
              variant="h3"
              fontWeight={900}
              letterSpacing={2}
            >
              GOAL GUESS
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{
                maxWidth: 320,
              }}
            >
              Predict every goal, climb the leaderboard and become the football
              champion.
            </Typography>
          </Stack>

          {/* Feature Chips */}

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Chip
              icon={<SportsScoreRoundedIcon />}
              label="Live Matches"
              color="success"
              variant="outlined"
            />

            <Chip
              icon={<TrendingUpRoundedIcon />}
              label="Predictions"
              color="info"
              variant="outlined"
            />

            <Chip
              icon={<EmojiEventsRoundedIcon />}
              label="Leaderboards"
              color="warning"
              variant="outlined"
            />
          </Stack>

          <TextField
            fullWidth
            label="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinue();
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "18px",
                background: "rgba(255,255,255,.04)",
                backdropFilter: "blur(10px)",

                "& fieldset": {
                  borderColor: "rgba(255,255,255,.12)",
                },

                "&:hover fieldset": {
                  borderColor: "#00E676",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00E676",
                  boxShadow: "0 0 12px rgba(0,230,118,.35)",
                },
              },
            }}
          />

          <motion.div
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            style={{ width: "100%" }}
          >
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleContinue}
              disabled={loading}
              endIcon={!loading && <ArrowForwardRoundedIcon />}
              sx={{
                height: 58,
                borderRadius: "18px",
                fontSize: 17,
                fontWeight: 700,
                textTransform: "none",
                background:
                  "linear-gradient(135deg,#00E676,#00B8FF)",

                boxShadow:
                  "0 0 28px rgba(0,230,118,.45)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#24ff88,#26c6ff)",
                  boxShadow:
                    "0 0 45px rgba(0,230,118,.75)",
                },
              }}
            >
              {loading ? "Entering Stadium..." : "Kick Off"}
            </Button>
          </motion.div>

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            Every prediction counts. Every goal changes the game.
          </Typography>
        </Stack>
      </GlassCard>
    </motion.div>
  );
}