import {
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import type { LeaderboardUser } from "../types/Leaderboard";


interface Props {
  rank: number;
  user: LeaderboardUser;
}

export default function LeaderboardRow({
  rank,
  user,
}: Props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py={1.5}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Typography
          fontWeight={700}
          width={24}
        >
          {rank}
        </Typography>

        <Avatar>
          {user.username[0]}
        </Avatar>

        <Typography fontWeight={600}>
          {user.username}
        </Typography>
      </Box>

      <Typography
        color="primary"
        fontWeight={700}
      >
        {user.points}
      </Typography>
    </Box>
  );
}