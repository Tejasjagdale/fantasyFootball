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
  disabled?: boolean;
}

export default function ScoreSelector({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={{
        xs: 0.75,
        sm: 1.5,
        md: 2,
      }}
    >
      <IconButton
        disabled={disabled || value === 0}
        onClick={() => onChange(value - 1)}
        sx={{
          bgcolor: "rgba(255,255,255,.06)",
          width: {
            xs: 36,
            sm: 46,
            md: 55,
          },
          height: {
            xs: 36,
            sm: 46,
            md: 55,
          },
          "& svg": {
            fontSize: {
              xs: 18,
              sm: 22,
              md: 26,
            },
          },
        }}
      >
        <RemoveRoundedIcon />
      </IconButton>

      <Typography
        fontWeight={800}
        sx={{
          width: {
            xs: 34,
            sm: 48,
            md: 80,
          },
          textAlign: "center",
          lineHeight: 1,
          fontSize: {
            xs: "1.8rem",
            sm: "2.4rem",
            md: "4rem",
          },
        }}
      >
        {value}
      </Typography>

      <IconButton
        disabled={disabled || value >= 20}
        onClick={() => onChange(value + 1)}
        sx={{
          bgcolor: "rgba(255,255,255,.06)",
          width: {
            xs: 36,
            sm: 46,
            md: 55,
          },
          height: {
            xs: 36,
            sm: 46,
            md: 55,
          },
          "& svg": {
            fontSize: {
              xs: 18,
              sm: 22,
              md: 26,
            },
          },
        }}
      >
        <AddRoundedIcon />
      </IconButton>
    </Box>
  );
}