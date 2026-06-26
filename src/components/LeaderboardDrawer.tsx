/* eslint-disable react-hooks/immutability */

import {
  Avatar,
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
import { collection, getDocs } from "firebase/firestore";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";

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
  const username = localStorage.getItem("username");

  const [loading, setLoading] = useState(false);

  const [leaderboard, setLeaderboard] = useState<
    LeaderboardUser[]
  >([]);

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

      const map = new Map<string, LeaderboardUser>();

      snapshot.forEach((doc) => {
        const data = doc.data();

        const existing = map.get(data.username) ?? {
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

        map.set(data.username, existing);
      });

      const result = Array.from(map.values()).sort(
        (a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
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

  const totalPredictions = useMemo(
    () =>
      leaderboard.reduce(
        (sum, u) => sum + u.predictions,
        0
      ),
    [leaderboard]
  );


  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "80vh",
          bgcolor: "#08131f",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          px: 3,
          py: 3,
          color: "#fff",
        },
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        mb={2}
      >
        🏆 Leaderboard
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        mb={3}
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
      </Stack>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          py={10}
        >
          <CircularProgress
            sx={{ color: "#00E676" }}
          />
        </Box>
      )}

      {!loading && (
        <List disablePadding>
          {leaderboard.map((user, index) => {
            const highlight =
              user.username === username;

            const perfectRate =
              user.predictions > 0
                ? Math.round(
                  (user.exactPredictions /
                    user.predictions) *
                  100
                )
                : 0;

            return (
              <Box
                key={user.username}
              >
                <ListItem
                  sx={{
                    borderRadius: 2,
                    mb: 1.5,
                    py: 2,
                    px: 2,

                    bgcolor: highlight
                      ? "rgba(0,230,118,.10)"
                      : "rgba(255,255,255,.03)",

                    border: highlight
                      ? "1px solid rgba(0,230,118,.30)"
                      : "1px solid rgba(255,255,255,.05)",

                    transition: ".25s",

                    "&:hover": {
                      transform:
                        "translateY(-2px)",
                      bgcolor:
                        "rgba(255,255,255,.06)",
                    },
                  }}
                >
                  <Stack
                    width="100%"
                    spacing={2}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 42,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {index === 0 ? (
                          <Typography
                            sx={{
                              fontSize: 30,
                              filter: "drop-shadow(0 0 8px rgba(255,215,0,.45))",
                            }}
                          >
                            🥇
                          </Typography>
                        ) : index === 1 ? (
                          <Typography
                            sx={{
                              fontSize: 30,
                              filter: "drop-shadow(0 0 8px rgba(192,192,192,.45))",
                            }}
                          >
                            🥈
                          </Typography>
                        ) : index === 2 ? (
                          <Typography
                            sx={{
                              fontSize: 30,
                              filter: "drop-shadow(0 0 8px rgba(205,127,50,.45))",
                            }}
                          >
                            🥉
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: 18,
                              color: "rgba(255,255,255,.55)",
                            }}
                          >
                            #{index + 1}
                          </Typography>
                        )}
                      </Box>

                      <Avatar
                        sx={{
                          background: highlight
                            ? "linear-gradient(135deg,#00E676,#00BCD4)"
                            : "linear-gradient(135deg,#4F46E5,#2563EB)",
                          fontWeight: 700,
                        }}
                      >
                        {user.username
                          .charAt(0)
                          .toUpperCase()}
                      </Avatar>

                      <Box flex={1}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <Typography
                            fontWeight={700}
                            fontSize={17}
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
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "rgba(255,255,255,.55)",
                            mt: 0.3,
                          }}
                        >
                          {perfectRate}% perfect prediction rate
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Chip
                        size="small"
                        icon={
                          <EmojiEventsRoundedIcon />
                        }
                        label={`${user.points} pts`}
                        sx={{
                          bgcolor: "#162231",
                          color: "#fff",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                        }}
                      />

                      <Chip
                        size="small"
                        icon={
                          <SportsSoccerRoundedIcon />
                        }
                        label={`${user.exactPredictions} perfect`}
                        sx={{
                          bgcolor: "#162231",
                          color: "#fff",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                        }}
                      />

                      <Chip
                        size="small"
                        icon={
                          <TrackChangesRoundedIcon />
                        }
                        label={`${user.predictions} predictions`}
                        sx={{
                          bgcolor: "#162231",
                          color: "#fff",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                        }}
                      />
                    </Stack>

                  </Stack>
                </ListItem>

                {index !==
                  leaderboard.length - 1 && (
                    <Divider
                      sx={{
                        borderColor:
                          "rgba(255,255,255,.05)",
                        my: 0.5,
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