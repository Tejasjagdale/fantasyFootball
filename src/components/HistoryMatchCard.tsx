import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";

import GlassCard from "./GlassCard";

interface Props {
  homeTeam: string;
  awayTeam: string;

  homeLogo: string;
  awayLogo: string;

  homeScore: number;
  awayScore: number;

  kickoff: string;

  stadium?: string;

  predictions: number;

  onClick: () => void;
}

export default function HistoryMatchCard({
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  homeScore,
  awayScore,
  kickoff,
  stadium,
  predictions,
  onClick,
}: Props) {
  return (
    <GlassCard
      onClick={onClick}
      sx={{
        cursor: "pointer",
        transition: ".25s",

        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Stack spacing={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Chip
            color="success"
            size="small"
            icon={<SportsSoccerRoundedIcon />}
            label="COMPLETE"
          />

          <Typography
            color="text.secondary"
            fontSize={13}
          >
            {kickoff}
          </Typography>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="1fr auto 1fr"
          alignItems="center"
          gap={2}
        >
          <Stack alignItems="center" spacing={1}>
            <Box
              component="img"
              src={homeLogo}
              sx={{
                width: 54,
                height: 54,
                objectFit: "contain",
              }}
            />

            <Typography
              fontWeight={700}
              textAlign="center"
            >
              {homeTeam}
            </Typography>
          </Stack>

          <Typography
            fontWeight={900}
            fontSize={30}
            color="primary"
          >
            {homeScore} - {awayScore}
          </Typography>

          <Stack alignItems="center" spacing={1}>
            <Box
              component="img"
              src={awayLogo}
              sx={{
                width: 54,
                height: 54,
                objectFit: "contain",
              }}
            />

            <Typography
              fontWeight={700}
              textAlign="center"
            >
              {awayTeam}
            </Typography>
          </Stack>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            color="text.secondary"
            fontSize={13}
          >
            {stadium}
          </Typography>

          <Typography
            display="flex"
            alignItems="center"
            gap={1}
            color="primary"
            fontWeight={700}
          >
            {predictions} Predictions

            <ArrowForwardIosRoundedIcon
              sx={{
                fontSize: 14,
              }}
            />
          </Typography>
        </Box>
      </Stack>
    </GlassCard>
  );
}