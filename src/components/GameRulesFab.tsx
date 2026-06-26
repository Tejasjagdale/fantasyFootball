import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import SportsScoreRoundedIcon from "@mui/icons-material/SportsScoreRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { useState } from "react";
import { motion } from "framer-motion";

const rules = [
  {
    title: "Perfect Prediction",
    points: 5,
    icon: <EmojiEventsRoundedIcon />,
    color: "#FF9800",
    desc: "Predict the exact final score. This is the highest possible score and does not stack with other bonuses.",
  },
  {
    title: "Correct Match Outcome",
    points: 2,
    icon: <EmojiEventsRoundedIcon />,
    color: "#00E676",
    desc: "Correctly predict the winner or a draw.",
  },
  {
    title: "Correct Goal Difference",
    points: 2,
    icon: <CheckCircleRoundedIcon />,
    color: "#FFC107",
    desc: "Predict the correct winning margin (e.g. 2-1 and 3-2 both have a +1 goal difference).",
  },
  {
    title: "One Team's Exact Score",
    points: 1,
    icon: <SportsScoreRoundedIcon />,
    color: "#00BCD4",
    desc: "Earn 1 bonus point for each team's score you predict exactly.",
  },
];

export default function GameRulesFab() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Fab
                component={motion.button}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: .95 }}
                onClick={() => setOpen(true)}
                sx={{
                    position: "fixed",
                    bottom: 28,
                    right: 28,
                    zIndex: 2000,
                    width: 64,
                    height: 64,
                    background:
                        "linear-gradient(135deg,#00E676,#00BCD4)",
                    color: "#000",
                    boxShadow:
                        "0 10px 40px rgba(0,230,118,.45)",
                }}
            >
                <HelpRoundedIcon fontSize="large" />
            </Fab>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        background: "#09131F",
                        color: "white",
                    }
                }}
            >

                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                        >
                            How Scoring Works
                        </Typography>

                        <Typography
                            color="rgba(255,255,255,.55)"
                        >
                            Earn points by predicting match results.
                        </Typography>

                    </Box>

                    <IconButton
                        onClick={() => setOpen(false)}
                        sx={{ color: "white" }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>

                </DialogTitle>

                <DialogContent>

                    <List>

                        {rules.map(rule => (

                            <ListItem
                                key={rule.title}
                                sx={{
                                    mb: 2,
                                    borderRadius: 3,
                                    bgcolor: "rgba(255,255,255,.04)",
                                }}
                            >

                                <ListItemIcon>

                                    <Box
                                        sx={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: 2,
                                            bgcolor: rule.color,
                                            color: "#000",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {rule.icon}
                                    </Box>

                                </ListItemIcon>

                                <ListItemText
                                    primary={rule.title}
                                    secondary={rule.desc}
                                    primaryTypographyProps={{
                                        fontWeight: 700,
                                    }}
                                    secondaryTypographyProps={{
                                        color: "rgba(255,255,255,.55)",
                                    }}
                                />

                                <Typography
                                    fontWeight={800}
                                    color="#00E676"
                                >
                                    +{rule.points}
                                </Typography>

                            </ListItem>

                        ))}

                    </List>

                    <Box
                        mt={3}
                        p={2}
                        borderRadius={1}
                        bgcolor="rgba(0,230,118,.08)"
                    >
                        <Typography
                            fontWeight={700}
                            gutterBottom
                        >
                            Example
                        </Typography>

                        <Typography color="rgba(255,255,255,.7)">
                            Actual score: <b>2-1</b>
                        </Typography>

                        <Typography color="rgba(255,255,255,.7)">
                            Your prediction: <b>2-0</b>
                        </Typography>

                        <Typography
                            mt={1}
                            color="#00E676"
                            fontWeight={700}
                        >
                            Winner (2) + Team Score (1) = 3 points
                        </Typography>

                    </Box>

                </DialogContent>

            </Dialog>

        </>
    );
}
