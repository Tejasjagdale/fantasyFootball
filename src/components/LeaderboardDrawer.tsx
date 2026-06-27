/* eslint-disable react-hooks/immutability */

import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

import { db } from "../firebase/firebase";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface LeaderboardUser {
  username: string;
  points: number;
  exactPredictions: number;
  predictions: number;
}

export default function LeaderboardDrawer({
  open,
  onClose,
}: Props) {
  const username =
    localStorage.getItem("username");

  const [loading, setLoading] =
    useState(false);

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardUser[]>([]);

  useEffect(() => {
    if (!open) return;

    loadLeaderboard();
  }, [open]);

  async function loadLeaderboard() {
    setLoading(true);

    try {
      const snapshot = await getDocs(
        collection(db, "predictions")
      );

      const map = new Map<
        string,
        LeaderboardUser
      >();

      snapshot.forEach((doc) => {
        const data = doc.data();

        const existing =
          map.get(data.username) ?? {
            username: data.username,
            points: 0,
            exactPredictions: 0,
            predictions: 0,
          };

        existing.points += data.score ?? 0;

        existing.predictions++;

        if ((data.score ?? 0) === 5) {
          existing.exactPredictions++;
        }

        map.set(
          data.username,
          existing
        );
      });

      const result =
        Array.from(map.values()).sort(
          (a, b) => {
            if (
              b.points !== a.points
            ) {
              return (
                b.points - a.points
              );
            }

            return (
              b.exactPredictions -
              a.exactPredictions
            );
          }
        );

      setLeaderboard(result);
    } finally {
      setLoading(false);
    }
  }

  const totalPredictions =
    useMemo(
      () =>
        leaderboard.reduce(
          (sum, u) =>
            sum + u.predictions,
          0
        ),
      [leaderboard]
    );

  const currentUser =
    leaderboard.find(
      (u) =>
        u.username === username
    );

  const currentRank =
    leaderboard.findIndex(
      (u) =>
        u.username === username
    ) + 1;

  const medal = (
    index: number
  ) => {
    if (index === 0)
      return "🥇";

    if (index === 1)
      return "🥈";

    if (index === 2)
      return "🥉";

    return `#${index + 1}`;
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "82vh",
          bgcolor: "#08131f",
          color: "#fff",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}

      <Box
        sx={{
          px: 1.5,
          pt: 1.5,
          pb: 1,
          background:
            "linear-gradient(180deg,#122033,#08131f)",
          borderBottom:
            "1px solid rgba(255,255,255,.06)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              fontSize={25}
              fontWeight={900}
            >
              🏆 Leaderboard
            </Typography>

            <Typography
              color="rgba(255,255,255,.6)"
            >
              Season Standings
            </Typography>
          </Box>

          <WorkspacePremiumRoundedIcon
            sx={{
              fontSize: 45,
              color: "#FFD54F",
              filter:
                "drop-shadow(0 0 10px rgba(255,213,79,.45))",
            }}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          mt={1}
          flexWrap="wrap"
        >
          <Chip
            label={`${leaderboard.length} Players`}
            sx={{
              bgcolor: "#162231",
              color: "#fff",
            }}
          />

          <Chip
            label={`${totalPredictions} Predictions`}
            sx={{
              bgcolor: "#162231",
              color: "#fff",
            }}
          />

          {currentUser && (
            <Chip
              color="success"
              label={`Rank #${currentRank}`}
            />
          )}
        </Stack>

        {currentUser && (
          <Box
            mt={1}
            sx={{
              p: 1.5,
              borderRadius: 1,
              background:
                "linear-gradient(135deg,#00E67622,#00BCD422)",
              border:
                "1px solid rgba(0,230,118,.25)",
            }}
          >
            <Typography
              variant="caption"
              color="rgba(255,255,255,.65)"
            >
              YOUR STANDING
            </Typography>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  fontWeight={800}
                  fontSize={20}
                >
                  {currentUser.username}
                </Typography>

                <Typography
                  color="rgba(255,255,255,.55)"
                >
                  Rank #{currentRank}
                </Typography>
              </Box>

              <Box textAlign="right">
                <Typography
                  fontSize={30}
                  fontWeight={900}
                  color="#00E676"
                  lineHeight={1}
                >
                  {currentUser.points}
                </Typography>

                <Typography
                  variant="caption"
                >
                  pts
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress
            sx={{
              color: "#00E676",
            }}
          />
        </Box>
      )}

      {!loading && (
        <List
          disablePadding
          sx={{
            px: 1,
            py: 1.5,
            overflowY: "auto",
          }}
        >
          {leaderboard.map((user, index) => {

            const highlight =
              user.username === username;

            const accuracy =
              user.predictions
                ? Math.round(
                  (user.exactPredictions /
                    user.predictions) *
                  100
                )
                : 0;

            const top3 =
              index < 3;
            return (
              <Box key={user.username} mb={1.5}>
                <ListItem
                  sx={{
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    bgcolor: highlight
                      ? "rgba(0,230,118,.10)"
                      : top3
                        ? "rgba(255,255,255,.05)"
                        : "rgba(255,255,255,.025)",

                    border: highlight
                      ? "1px solid rgba(0,230,118,.35)"
                      : top3
                        ? "1px solid rgba(255,255,255,.10)"
                        : "1px solid rgba(255,255,255,.05)",

                    transition: ".25s",

                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: "#00E676",
                      bgcolor: "rgba(255,255,255,.06)",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    width="100%"
                  >
                    {/* Rank */}

                    <Box
                      width={42}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexShrink={0}
                    >
                      <Typography
                        fontSize={28}
                        fontWeight={800}
                      >
                        {medal(index)}
                      </Typography>
                    </Box>

                    {/* User */}

                    <Box flex={1} minWidth={0}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Typography
                          fontWeight={800}
                          noWrap
                        >
                          {user.username}
                        </Typography>

                        {highlight && (
                          <Chip
                            size="small"
                            label="YOU"
                            color="success"
                          />
                        )}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={2}
                        mt={0.8}
                        flexWrap="wrap"
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <EmojiEventsRoundedIcon
                            sx={{
                              fontSize: 16,
                              color: "#FFC107",
                            }}
                          />

                          <Typography
                            variant="caption"
                          >
                            {user.exactPredictions}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <TrackChangesRoundedIcon
                            sx={{
                              fontSize: 16,
                              color: "#00BCD4",
                            }}
                          />

                          <Typography
                            variant="caption"
                          >
                            {accuracy}%
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <SportsSoccerRoundedIcon
                            sx={{
                              fontSize: 16,
                              color: "#90CAF9",
                            }}
                          />

                          <Typography
                            variant="caption"
                          >
                            {user.predictions}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Points */}

                    <Box
                      textAlign="right"
                      flexShrink={0}
                    >
                      <Typography
                        fontSize={25}
                        fontWeight={900}
                        color={
                          top3
                            ? "#FFD54F"
                            : "#00E676"
                        }
                        lineHeight={1}
                      >
                        {user.points}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="rgba(255,255,255,.6)"
                      >
                        pts
                      </Typography>
                    </Box>
                  </Stack>
                </ListItem>

                {index !==
                  leaderboard.length - 1 && (
                    <Divider
                      sx={{
                        my: 1,
                        borderColor:
                          "rgba(255,255,255,.05)",
                      }}
                    />
                  )}
              </Box>
            );
          })}
        </List>
      )}
    </Drawer>
  );
}