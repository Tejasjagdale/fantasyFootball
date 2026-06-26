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
        desc:
            "Predict the exact regulation-time score. If the match goes to penalties, you must also predict the correct penalty winner. This does not stack with other bonuses.",
    },
    {
        title: "Correct Match Outcome",
        points: 2,
        icon: <EmojiEventsRoundedIcon />,
        color: "#00E676",
        desc:
            "Correctly predict the winning team. For drawn matches, you must also predict the correct penalty winner.",
    },
    {
        title: "Correct Goal Difference",
        points: 2,
        icon: <CheckCircleRoundedIcon />,
        color: "#FFC107",
        desc:
            "Predict the correct goal difference after regulation time (e.g. 2-1 and 3-2 both have a +1 goal difference). Not applicable for drawn matches.",
    },
    {
        title: "One Team's Exact Score",
        points: 1,
        icon: <SportsScoreRoundedIcon />,
        color: "#00BCD4",
        desc:
            "Earn 1 point for each team's regulation-time score predicted exactly.",
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
                    bottom: {
                        xs: 16,
                        sm: 24,
                        md: 28,
                    },
                    right: {
                        xs: 16,
                        sm: 24,
                        md: 28,
                    },
                    zIndex: 2000,

                    width: {
                        xs: 50,
                        sm: 58,
                        md: 64,
                    },

                    height: {
                        xs: 50,
                        sm: 58,
                        md: 64,
                    },

                    minHeight: {
                        xs: 50,
                        sm: 58,
                        md: 64,
                    },

                    background:
                        "linear-gradient(135deg,#00E676,#00BCD4)",

                    color: "#000",

                    boxShadow:
                        "0 10px 40px rgba(0,230,118,.45)",
                }}
            >
                <HelpRoundedIcon
                    sx={{
                        fontSize: {
                            xs: 22,
                            sm: 26,
                            md: 32,
                        },
                    }}
                />
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
                            Examples
                        </Typography>

                        <Typography color="rgba(255,255,255,.7)">
                            <b>Normal Match</b>
                        </Typography>

                        <Typography color="rgba(255,255,255,.7)">
                            Actual: <b>2-1</b>
                        </Typography>

                        <Typography color="rgba(255,255,255,.7)">
                            Prediction: <b>2-0</b>
                        </Typography>

                        <Typography
                            mt={1}
                            color="#00E676"
                            fontWeight={700}
                        >
                            Winner (2) + Home Score (1) = 3 points
                        </Typography>

                        <Box mt={3} />

                        <Typography color="rgba(255,255,255,.7)">
                            <b>Penalty Shootout</b>
                        </Typography>

                        <Typography color="rgba(255,255,255,.7)">
                            Actual: <b>1-1 (France wins on penalties)</b>
                        </Typography>

                        <Typography color="rgba(255,255,255,.7)">
                            Prediction: <b>1-1 (France)</b>
                        </Typography>

                        <Typography
                            mt={1}
                            color="#00E676"
                            fontWeight={700}
                        >
                            Perfect Prediction = 5 points
                        </Typography>

                        <Typography
                            mt={1}
                            color="rgba(255,255,255,.65)"
                        >
                            If you predicted <b>1-1</b> but selected <b>Norway</b> as the penalty winner, you would not receive the outcome/perfect prediction points.
                        </Typography>
                    </Box>
                </DialogContent>

            </Dialog>

        </>
    );
}
