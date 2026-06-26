import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

import GlassCard from "./GlassCard";
import ScoreSelector from "./ScorePicker";

import teams from "../data/teams.json";

interface Props {
  homeTeam: string; // FIFA Code (USA, RSA, BRA...)
  awayTeam: string;

  homeScore: number;
  awayScore: number;
  penaltyWinner?: string | null;
  onHomeScoreChange: (score: number) => void;
  onAwayScoreChange: (score: number) => void;
  onPenaltyWinnerChange?: (
    team: string
  ) => void;
  disabled?: boolean;
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
  penaltyWinner,
  onPenaltyWinnerChange,
  disabled = false,
}: Props) {
  const home = teams.teams.find(
    (team) => team.fifa_code === homeTeam
  );

  const away = teams.teams.find(
    (team) => team.fifa_code === awayTeam
  );

  const isDrawPrediction =
    homeScore === awayScore;

  if (!home || !away) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        width: "100%",
        maxWidth: 760,
      }}
    >
      <GlassCard>
        <Stack spacing={{ xs: 2, md: 4 }}>
          {/* Header */}

          <Box textAlign="center">
            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontSize: {
                  xs: ".72rem",
                  sm: ".85rem",
                  md: ".95rem",
                },
              }}
            >
              FIFA World Cup 2026
            </Typography>
          </Box>

          {/* Teams */}

          <Box
            display="grid"
            gridTemplateColumns="1fr auto 1fr"
            alignItems="center"
            textAlign="center"
            gap={{
              xs: 1.5,
              md: 4,
            }}
          >
            {/* Home */}

            <Stack
              spacing={{ xs: 1, md: 2 }}
              alignItems="center"
            >
              <Box
                sx={{
                  width: {
                    xs: 60,
                    sm: 80,
                    md: 130,
                  },
                  height: {
                    xs: 60,
                    sm: 80,
                    md: 130,
                  },
                  bgcolor: "#fff",
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: {
                    xs: 0.8,
                    md: 1.5,
                  },
                  boxShadow:
                    "0 0 30px rgba(0,230,118,.22)",
                }}
              >
                <Box
                  component="img"
                  src={home.flag}
                  alt={home.name_en}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  fontSize: {
                    xs: ".85rem",
                    sm: "1rem",
                    md: "1.45rem",
                  },
                }}
              >
                {home.name_en}
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "primary.main",
                fontWeight: 900,
                fontSize: {
                  xs: "1.3rem",
                  sm: "1.7rem",
                  md: "2.3rem",
                },
              }}
            >
              VS
            </Typography>

            {/* Away */}

            <Stack
              spacing={{ xs: 1, md: 2 }}
              alignItems="center"
            >
              <Box
                sx={{
                  width: {
                    xs: 60,
                    sm: 80,
                    md: 130,
                  },
                  height: {
                    xs: 60,
                    sm: 80,
                    md: 130,
                  },
                  bgcolor: "#fff",
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: {
                    xs: 0.8,
                    md: 1.5,
                  },
                  boxShadow:
                    "0 0 30px rgba(0,184,255,.22)",
                }}
              >
                <Box
                  component="img"
                  src={away.flag}
                  alt={away.name_en}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  fontSize: {
                    xs: ".85rem",
                    sm: "1rem",
                    md: "1.45rem",
                  },
                }}
              >
                {away.name_en}
              </Typography>
            </Stack>
          </Box>

          {/* Prediction */}

          <Box textAlign="center">
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                letterSpacing: 2,
                mb: {
                  xs: 1.5,
                  md: 3,
                },
                fontSize: {
                  xs: ".75rem",
                  md: ".95rem",
                },
              }}
            >
              YOUR PREDICTION
            </Typography>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={{
                xs: 2,
                md: 4,
              }}
            >
              <ScoreSelector
                value={homeScore}
                onChange={onHomeScoreChange}
                disabled={disabled}
              />

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "1.4rem",
                    md: "2.2rem",
                  },
                }}
              >
                -
              </Typography>

              <ScoreSelector
                value={awayScore}
                onChange={onAwayScoreChange}
                disabled={disabled}
              />
            </Box>
          </Box>

          {disabled && (
            <Typography
              textAlign="center"
              color="#00E676"
              fontWeight={700}
            >
              ✓ Prediction Locked
            </Typography>
          )}
        </Stack>
      </GlassCard>

      {isDrawPrediction && (
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: "auto"
          }}
          transition={{
            duration: .3
          }}
        >

          <Box
            mt={4}
            p={3}
            borderRadius={4}
            sx={{
              bgcolor: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >

            <Typography
              textAlign="center"
              fontWeight={700}
              mb={1}
            >
              ⚽ Penalty Shootout
            </Typography>

            <Typography
              textAlign="center"
              color="text.secondary"
              mb={3}
            >
              You predicted a draw.
              Select the team that wins on penalties.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row"
              }}
              spacing={2}
            >

              <Box
                onClick={() =>
                  onPenaltyWinnerChange?.(
                    homeTeam
                  )
                }
                sx={{
                  flex: 1,
                  cursor: "pointer",

                  p: 2,

                  borderRadius: 3,

                  textAlign: "center",

                  border:
                    penaltyWinner === homeTeam
                      ? "2px solid #00E676"
                      : "1px solid rgba(255,255,255,.08)",

                  bgcolor:
                    penaltyWinner === homeTeam
                      ? "rgba(0,230,118,.12)"
                      : "rgba(255,255,255,.03)",

                  transition: ".25s",

                  "&:hover": {

                    transform: "translateY(-2px)",

                    borderColor: "#00E676",

                  }

                }}
              >

                <Box
                  component="img"
                  src={home.flag}
                  sx={{
                    width: 48,
                    height: 48,
                    objectFit: "contain",
                    mb: 1,
                  }}
                />

                <Typography fontWeight={700}>
                  {home.name_en}
                </Typography>

              </Box>

              <Box
                onClick={() =>
                  onPenaltyWinnerChange?.(
                    awayTeam
                  )
                }
                sx={{
                  flex: 1,
                  cursor: "pointer",

                  p: 2,

                  borderRadius: 3,

                  textAlign: "center",

                  border:
                    penaltyWinner === awayTeam
                      ? "2px solid #00E676"
                      : "1px solid rgba(255,255,255,.08)",

                  bgcolor:
                    penaltyWinner === awayTeam
                      ? "rgba(0,230,118,.12)"
                      : "rgba(255,255,255,.03)",

                  transition: ".25s",

                  "&:hover": {

                    transform: "translateY(-2px)",

                    borderColor: "#00E676",

                  }

                }}
              >

                <Box
                  component="img"
                  src={away.flag}
                  sx={{
                    width: 48,
                    height: 48,
                    objectFit: "contain",
                    mb: 1,
                  }}
                />

                <Typography fontWeight={700}>
                  {away.name_en}
                </Typography>

              </Box>

            </Stack>

          </Box>

        </motion.div>
      )}
    </motion.div>
  );
}