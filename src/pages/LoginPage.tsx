/* eslint-disable react-hooks/purity */
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

import LoginCard from "../components/LoginCard";
import { getUser } from "../firebase/firestore";

export default function LoginPage() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogin = async (username: string) => {
    const user = await getUser(username);

    if (!user) {
      setOpenDialog(true);
      return;
    }

    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);

    window.location.href = "/";
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(180deg,#01060d 0%,#07111b 45%,#03060b 100%)",
      }}
    >
      {/* Stadium glow */}
      <motion.div
        animate={{
          opacity: [0.25, 0.6, 0.25],
          scale: [1, 1.15, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        style={{
          position: "absolute",
          top: -250,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,#00E67655 0%,transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Blue glow */}
      <motion.div
        animate={{
          x: [-80, 80, -80],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
        }}
        style={{
          position: "absolute",
          bottom: -200,
          right: -150,
          width: 550,
          height: 550,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,#00B8FF55 0%,transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Stadium Lights */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + i,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${10 + i * 12}%`,
            width: 2,
            height: "100%",
            background:
              "linear-gradient(to bottom,rgba(255,255,255,.45),transparent)",
            filter: "blur(2px)",
          }}
        />
      ))}

      {/* Football Pitch */}
      <Box
        sx={{
          position: "absolute",
          bottom: -180,
          width: 900,
          height: 450,
          borderRadius: "50%",
          border: "1px solid rgba(0,230,118,.18)",
          opacity: 0.35,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          width: 700,
          height: 350,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,.08)",
          opacity: 0.15,
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -35, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 2,
          }}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#00E676",
            boxShadow: "0 0 10px #00E676",
          }}
        />
      ))}

      {/* Login Card */}
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
        }}
      >
        <LoginCard onLogin={handleLogin} />
      </Box>

      {/* Player Not Found Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
            minWidth: 360,
            background:
              "linear-gradient(145deg,#111827,#0B1220)",
            color: "white",
            border: "1px solid rgba(255,255,255,.08)",
            boxShadow: "0 20px 50px rgba(0,0,0,.45)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pt: 4,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          ⚽ Player Not Found
        </DialogTitle>

        <DialogContent>
          <Typography
            align="center"
            sx={{
              color: "rgba(255,255,255,.7)",
              mt: 1,
            }}
          >
            We couldn't find a player with that username.
            <br />
            Please check your username and try again.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 4,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenDialog(false)}
            sx={{
              px: 5,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: "none",
              background:
                "linear-gradient(90deg,#00E676,#00B8FF)",
              "&:hover": {
                background:
                  "linear-gradient(90deg,#1AFF87,#26C6FF)",
              },
            }}
          >
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}