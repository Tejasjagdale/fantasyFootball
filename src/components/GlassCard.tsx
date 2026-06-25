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
        y: -5
      }}
      transition={{
        duration: .25
      }}
      elevation={0}
      {...props}
      sx={{
        p: 4,
        position: "relative",
        overflow: "hidden",

        background:
          "linear-gradient(145deg,#1a2332,#131c29)",

        border:
          "1px solid rgba(255,255,255,.08)",

        borderRadius: 5,

        boxShadow:
          "0 30px 60px rgba(0,0,0,.45)",

        ...sx,

        "&::before": {
          content: '""',
          position: "absolute",
          right: -100,
          top: -100,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(#00E67622,transparent)"
        }
      }}
    >
      {children}
    </Paper>
  );
}