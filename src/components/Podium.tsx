import { Avatar, Box, Typography } from "@mui/material";

interface Props {
  top3: {
    username: string;
    points: number;
  }[];
}

const medals = ["🥇", "🥈", "🥉"];

export default function Podium({ top3 }: Props) {
  return (
    <Box
      display="flex"
      justifyContent="space-evenly"
      mt={3}
      mb={4}
    >
      {top3.map((p, i) => (
        <Box
          key={p.username}
          textAlign="center"
        >
          <Typography fontSize={30}>
            {medals[i]}
          </Typography>

          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              bgcolor: "primary.main",
              fontWeight: 700,
              my: 1,
            }}
          >
            {p.username[0].toUpperCase()}
          </Avatar>

          <Typography fontWeight={700}>
            {p.username}
          </Typography>

          <Typography color="primary">
            {p.points} pts
          </Typography>
        </Box>
      ))}
    </Box>
  );
}