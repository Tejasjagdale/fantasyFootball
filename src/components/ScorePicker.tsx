// src/components/ScoreSelector.tsx

import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function ScoreSelector({
  value,
  onChange,
}: Props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
    >
      <IconButton
        onClick={() => value > 0 && onChange(value - 1)}
        sx={{
          bgcolor: "rgba(255,255,255,.05)",
          width: 55,
          height: 55
        }}
      >
        <RemoveRoundedIcon />
      </IconButton>

      <Typography
        variant="h1"
        fontWeight={800}
        sx={{
          width: 80,
          textAlign: "center"
        }}
      >
        {value}
      </Typography>

      <IconButton
        onClick={() => onChange(value + 1)}
        sx={{
          bgcolor: "rgba(255,255,255,.05)",
          width: 55,
          height: 55
        }}
      >
        <AddRoundedIcon />
      </IconButton>
    </Box>
  );
}