import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";

import GlassCard from "./GlassCard";
import { useNavigate } from "react-router-dom";

type Props = {
  onLogin: (username: string) => void;
};

export default function LoginCard({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleContinue = () => {
    const value = username.trim().toLowerCase();

    if (!value) return;

    onLogin(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5 }}
    >
      <GlassCard>
        <Stack spacing={4} alignItems="center">
          <SportsSoccerRoundedIcon
            color="primary"
            sx={{ fontSize: 70 }}
          />

          <Box textAlign="center">
            <Typography variant="h4" fontWeight={700}>
              Goal Guess
            </Typography>

            <Typography color="text.secondary">
              Predict • Compete • Win
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinue();
            }}
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleContinue}
            sx={{
              py: 1.6,
              fontSize: 16,
              background:
                "linear-gradient(90deg,#00E676,#00B8FF)",
            }}
          >
            Continue
          </Button>

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={()=>{ navigate("/")}}
            sx={{
              py: 1.6,
              fontSize: 16,
              background:
                "linear-gradient(90deg,#00E676,#00B8FF)",
            }}
          >
            Home
          </Button>
        </Stack>
      </GlassCard>
    </motion.div>
  );
}