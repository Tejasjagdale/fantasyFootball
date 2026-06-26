// src/pages/MatchDetailsPage.tsx

import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import StadiumRoundedIcon from "@mui/icons-material/StadiumRounded";

import GlassCard from "../components/GlassCard";

const actualHome = 2;
const actualAway = 1;

const predictions = [
  {
    id: 1,
    name: "Tejas",
    home: 2,
    away: 1,
  },
  {
    id: 2,
    name: "Rahul",
    home: 1,
    away: 1,
  },
  {
    id: 3,
    name: "Aman",
    home: 3,
    away: 2,
  },
  {
    id: 4,
    name: "Sneha",
    home: 2,
    away: 1,
  },
  {
    id: 5,
    name: "Rohit",
    home: 0,
    away: 0,
  },
];

export default function MatchDetailsPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 5,
      }}
    >
      <Stack spacing={4}>
        {/* Match Header */}

        <GlassCard>
          <Stack spacing={3}>
            <Typography
              textAlign="center"
              color="primary"
              fontWeight={700}
            >
              FIFA World Cup 2026
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns="1fr auto 1fr"
              alignItems="center"
              textAlign="center"
            >
              <Stack spacing={1} alignItems="center">
                <Avatar
                  src="https://api.fifa.com/api/v3/picture/flags-sq-4/BRA"
                  sx={{
                    width: 70,
                    height: 70,
                  }}
                />

                <Typography fontWeight={700}>
                  Brazil
                </Typography>
              </Stack>

              <Typography
                fontSize={42}
                fontWeight={900}
                color="primary"
              >
                {actualHome} - {actualAway}
              </Typography>

              <Stack spacing={1} alignItems="center">
                <Avatar
                  src="https://api.fifa.com/api/v3/picture/flags-sq-4/ARG"
                  sx={{
                    width: 70,
                    height: 70,
                  }}
                />

                <Typography fontWeight={700}>
                  Argentina
                </Typography>
              </Stack>
            </Box>

            <Divider />

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <StadiumRoundedIcon
                color="primary"
              />

              <Typography color="text.secondary">
                Mexico City Stadium
              </Typography>
            </Stack>

            <Chip
              color="success"
              label="COMPLETED"
              sx={{
                alignSelf: "center",
              }}
            />
          </Stack>
        </GlassCard>

        {/* Predictions */}

        <Typography
          variant="h5"
          fontWeight={800}
        >
          User Predictions
        </Typography>

        <Stack spacing={2}>
          {predictions.map((prediction) => {
            const correct =
              prediction.home === actualHome &&
              prediction.away === actualAway;

            return (
              <GlassCard key={prediction.id}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Avatar>
                      {prediction.name[0]}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={700}>
                        {prediction.name}
                      </Typography>

                      <Typography
                        color="text.secondary"
                      >
                        Prediction
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Typography
                      fontSize={26}
                      fontWeight={900}
                    >
                      {prediction.home} - {prediction.away}
                    </Typography>

                    {correct ? (
                      <CheckCircleRoundedIcon
                        sx={{
                          color: "#00E676",
                        }}
                      />
                    ) : (
                      <CancelRoundedIcon
                        sx={{
                          color: "#ff5252",
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </GlassCard>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}