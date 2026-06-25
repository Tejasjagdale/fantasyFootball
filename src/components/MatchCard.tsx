// src/components/MatchCard.tsx

import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import GlassCard from "./GlassCard";
import ScoreSelector from "./ScorePicker";

interface Props {
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoff: string;
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  kickoff,
}: Props) {
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{ width: "100%", maxWidth: 880 }}
    >
      <GlassCard>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Box textAlign="center">
            <Typography
              color="primary"
              fontWeight={700}
              letterSpacing={2}
              textTransform="uppercase"
            >
              FIFA Club World Cup
            </Typography>

            <Chip
              icon={<AccessTimeRoundedIcon />}
              label={kickoff}
              color="success"
              sx={{
                mt: 2,
                px: 1.5,
                py: 1,
                fontWeight: 700,
                borderRadius: 2,
              }}
            />
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr auto 1fr" }}
            alignItems="center"
            gap={3}
            textAlign="center"
          >
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={homeLogo}
                sx={{
                  width: { xs: 100, md: 130 },
                  height: { xs: 100, md: 130 },
                  bgcolor: "#fff",
                  boxShadow: "0 0 40px rgba(0,230,118,0.22)",
                }}
              />
              <Typography variant="h5" fontWeight={700}>
                {homeTeam}
              </Typography>
            </Stack>

            <Stack spacing={1} alignItems="center">
              <Typography variant="h4" color="primary" fontWeight={800}>
                VS
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                Make your prediction before kickoff.
              </Typography>
            </Stack>

            <Stack spacing={2} alignItems="center">
              <Avatar
                src={awayLogo}
                sx={{
                  width: { xs: 100, md: 130 },
                  height: { xs: 100, md: 130 },
                  bgcolor: "#fff",
                  boxShadow: "0 0 40px rgba(0,184,255,0.22)",
                }}
              />
              <Typography variant="h5" fontWeight={700}>
                {awayTeam}
              </Typography>
            </Stack>
          </Box>

          <Box textAlign="center">
            <Typography
              color="text.secondary"
              fontWeight={700}
              letterSpacing={3}
              mb={3}
            >
              YOUR PREDICTION
            </Typography>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={{ xs: 2, md: 5 }}
              flexWrap="wrap"
            >
              <ScoreSelector value={home} onChange={setHome} />
              <Typography variant="h4" fontWeight={800}>
                -
              </Typography>
              <ScoreSelector value={away} onChange={setAway} />
            </Box>
          </Box>

          <Button
            size="large"
            fullWidth
            sx={{
              py: 1.8,
              fontSize: 17,
              fontWeight: 700,
              color: "#000",
              borderRadius: 3,
              background: "linear-gradient(90deg, #00E676, #00B8FF)",
              boxShadow: "0 20px 40px rgba(0,230,118,0.28)",
              transition: "transform 0.25s, background 0.25s",
              "&:hover": {
                transform: "translateY(-2px)",
                background: "linear-gradient(90deg, #00B8FF, #00E676)",
              },
            }}
          >
            Submit Prediction
          </Button>
        </Stack>
      </GlassCard>
    </motion.div>
  );
}