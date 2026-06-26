import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";

interface Props {
  username: string;
  onLeaderboardClick: () => void;
  onLogout: () => void;
}

export default function Navbar({
  username,
  onLeaderboardClick,
  onLogout,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <AppBar
      component={motion.div}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .5 }}

      elevation={0}

      position="sticky"

      sx={{
        mt: 2,
        mx: "auto",

        width: "min(96%,1200px)",

        background: "rgba(12,20,34,.78)",

        backdropFilter: "blur(28px)",

        border: "1px solid rgba(255,255,255,.08)",

        borderRadius: 4,

        boxShadow:
          "0 15px 60px rgba(0,0,0,.35)",

      }}
    >

      <Toolbar
        sx={{
          minHeight: isMobile ? 62 : 74,
          justifyContent: "space-between",
        }}
      >

        {/* Logo */}

        <Box
          display="flex"
          alignItems="center"
          gap={isMobile ? 1 : 2}
        >

          <Box
            sx={{
              width: isMobile ? 42 : 52,
              height: isMobile ? 42 : 52,
              borderRadius: 3,

              background:
                "linear-gradient(135deg,#00E676,#00BCD4)",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              boxShadow:
                "0 8px 25px rgba(0,230,118,.35)"
            }}
          >

            <SportsSoccerRoundedIcon
              sx={{
                color: "white",
                fontSize: isMobile ? 24 : 30
              }}
            />

          </Box>


            <Box>

              <Typography
                fontSize={!isMobile ? 13 : 11}
                color="rgba(255,255,255,.55)"
                letterSpacing={2}
              >
                FIFA WORLD CUP
              </Typography>

              <Typography
                fontSize={!isMobile ? 24 : 18}
                fontWeight={800}
              >
                GoalGuess
              </Typography>

            </Box>
          

        </Box>

        {/* Right */}

        <Box
          display="flex"
          alignItems="center"
          gap={isMobile ? 1 : 2}
        >

          <Tooltip title="Leaderboard">

            <IconButton

              onClick={onLeaderboardClick}

              sx={{

                bgcolor: "rgba(255,255,255,.05)",

                border:
                  "1px solid rgba(255,255,255,.06)",

                "&:hover": {
                  bgcolor: "#00E676",
                  color: "#000",
                }

              }}
            >

              <EmojiEventsRoundedIcon />

            </IconButton>

          </Tooltip>

          <Box

            display="flex"

            alignItems="center"

            gap={1.5}

            px={isMobile ? 0.7 : 1.5}
            py={isMobile ? 0.4 : 0.8}

            borderRadius={10}

            bgcolor="rgba(255,255,255,.05)"

            border="1px solid rgba(255,255,255,.06)"

          >

            <Avatar
              sx={{
                bgcolor: "#00E676",
                color: "#000",
                width: isMobile ? 32 : 34,
                height: isMobile ? 32 : 34,
              }}
            >
              {username?.charAt(0)?.toUpperCase()}
            </Avatar>

            {!isMobile && (
              <Typography fontWeight={700}>
                {username}
              </Typography>
            )}

          </Box>

          <Button
            onClick={onLogout}
            startIcon={!isMobile ? <LogoutRoundedIcon /> : undefined}

            sx={{
              minWidth: isMobile ? 42 : "auto",

              px: isMobile ? 1.2 : 2.5,

              py: 1,

              borderRadius: 8,

              color: "white",

              textTransform: "none",

              bgcolor: "rgba(255,255,255,.05)",

              border: "1px solid rgba(255,255,255,.08)",

              "&:hover": {
                bgcolor: "#ef4444",
                borderColor: "#ef4444",
              },
            }}
          >

            {isMobile ? <LogoutRoundedIcon /> : "Logout"}

          </Button>
        </Box>

      </Toolbar>

    </AppBar>

  );

}
