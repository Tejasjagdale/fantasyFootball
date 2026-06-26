import { Paper, type PaperProps } from "@mui/material";
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  sx,
  ...props
}: PaperProps) {
  return (
    <Paper
      component={motion.div}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.25,
      }}
      elevation={0}
      {...props}
      sx={{
        position: "relative",
        overflow: "hidden",

        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        borderRadius: {
          xs: 3,
          sm: 4,
          md: 5,
        },

        background:
          "linear-gradient(145deg,#1a2332,#131c29)",

        border:
          "1px solid rgba(255,255,255,.08)",

        boxShadow:
          "0 24px 48px rgba(0,0,0,.35)",

        ...sx,

        "&::before": {
          content: '""',
          position: "absolute",

          right: {
            xs: -60,
            md: -100,
          },

          top: {
            xs: -60,
            md: -100,
          },

          width: {
            xs: 130,
            md: 220,
          },

          height: {
            xs: 130,
            md: 220,
          },

          borderRadius: "50%",

          background:
            "radial-gradient(#00E67622, transparent)",

          pointerEvents: "none",
        },
      }}
    >
      {children}
    </Paper>
  );
}