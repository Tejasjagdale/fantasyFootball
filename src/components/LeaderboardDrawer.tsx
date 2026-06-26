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
import {
  collection,
  getDocs,
} from "firebase/firestore";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";

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

      const snapshot =
        await getDocs(
          collection(db, "predictions")
        );

      const map =
        new Map<string, LeaderboardUser>();

      snapshot.forEach(doc => {

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
        Array.from(map.values())
          .sort((a, b) => {

            if (b.points !== a.points)
              return b.points - a.points;

            return (
              b.exactPredictions -
              a.exactPredictions
            );

          });

      setLeaderboard(result);

    } finally {

      setLoading(false);

    }

  }

  const totalPredictions = useMemo(() =>

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
          bgcolor: "#09131f",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          p: 3,
        },
      }}
    >

      <Typography
        variant="h4"
        fontWeight={800}
        mb={1}
      >
        🏆 Leaderboard
      </Typography>

      <Typography
        color="rgba(255,255,255,.55)"
        mb={3}
      >
        {leaderboard.length} Players • {totalPredictions} Predictions
      </Typography>

      {loading && (

        <Box
          display="flex"
          justifyContent="center"
          py={8}
        >
          <CircularProgress />
        </Box>

      )}

      {!loading && (

        <List>

          {leaderboard.map((user, index) => {

            const medal =
              index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `#${index + 1}`;

            const highlight =
              user.username === username;

            return (

              <Box
                key={user.username}
              >

                <ListItem
                  sx={{
                    py: 2,
                    borderRadius: 3,

                    bgcolor: highlight
                      ? "rgba(0,230,118,.10)"
                      : "transparent",

                    border: highlight
                      ? "1px solid rgba(0,230,118,.25)"
                      : "1px solid transparent",
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    width="100%"
                  >

                    <Typography
                      fontSize={26}
                    >
                      {medal}
                    </Typography>

                    <Avatar
                      sx={{
                        bgcolor:
                          highlight
                            ? "#00E676"
                            : "#2196F3",
                      }}
                    >
                      {user.username
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>

                    <Box flex={1}>

                      <Typography
                        fontWeight={700}
                      >
                        {user.username}

                        {highlight &&
                          " (You)"}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        mt={0.5}
                      >

                        <Chip
                          size="small"
                          color="success"
                          icon={
                            <EmojiEventsRoundedIcon />
                          }
                          label={`${user.points} pts`}
                        />

                        <Chip
                          size="small"
                          color="warning"
                          icon={
                            <SportsSoccerRoundedIcon />
                          }
                          label={`${user.exactPredictions} perfect`}
                        />

                      </Stack>

                    </Box>

                  </Stack>

                </ListItem>

                {index !==
                  leaderboard.length - 1 && (
                  <Divider />
                )}

              </Box>

            );

          })}

        </List>

      )}

    </Drawer>

  );

}