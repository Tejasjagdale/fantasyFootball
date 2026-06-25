import {
  Box,
  Divider,
  Drawer,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import LeaderboardRow from "./LeaderboardRow";

interface Props {
  open: boolean;
  onClose: () => void;
}

const today = [
  { username: "Rahul", points: 14, exact: 2 },
  { username: "Tejas", points: 12, exact: 1 },
  { username: "Om", points: 10, exact: 1 },
  { username: "Akshay", points: 8, exact: 0 },
];

const overall = [
  { username: "Rahul", points: 92, exact: 12 },
  { username: "Tejas", points: 89, exact: 11 },
  { username: "Om", points: 81, exact: 8 },
  { username: "Akshay", points: 70, exact: 6 },
];

export default function LeaderboardDrawer({
  open,
  onClose,
}: Props) {
  const [tab, setTab] = useState<"today" | "overall">(
    "today"
  );

  const username = localStorage.getItem("username");

  const data = useMemo(
    () => (tab === "today" ? today : overall),
    [tab]
  );

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "80vh",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          px: 3,
          py: 2,
          bgcolor: "#09131f",
        },
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        🏆 Leaderboard
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <ToggleButtonGroup
          exclusive
          value={tab}
          onChange={(_, value) => value && setTab(value)}
          sx={{
            bgcolor: "rgba(255,255,255,.05)",
            borderRadius: 99,
            p: .5,

            "& .MuiToggleButton-root": {
              border: 0,
              borderRadius: 99,
              px: 3,
            },

            "& .Mui-selected": {
              bgcolor: "#00E676 !important",
              color: "#000",
            },
          }}
        >
          <ToggleButton value="today">
            Today
          </ToggleButton>

          <ToggleButton value="overall">
            Overall
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        px={1}
      >
        <Typography color="text.secondary">
          Player
        </Typography>

        <Typography color="text.secondary">
          Points
        </Typography>
      </Box>

      {data.map((user, index) => (
        <LeaderboardRow
          key={user.username}
          rank={index + 1}
          user={user}
          highlight={user.username === username}
        />
      ))}
    </Drawer>
  );
}