import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography,
    Box,
    Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import teamsData from "../data/teams.json"; // <-- adjust path if needed

import type { Match } from "../services/matchService";
import type { Prediction } from "../hooks/usePredictions";

interface Props {
    open: boolean;
    match: Match | null;
    loading: boolean;
    predictions: Prediction[];
    username: string;
    onClose: () => void;
}

export default function PredictionDialog({
    open,
    match,
    loading,
    predictions,
    username,
    onClose,
}: Props) {
    if (!match) return null;

    // Find teams from teams.json using FIFA code
    const homeTeam = teamsData.teams.find(
        (team) => team.fifa_code === match.team1
    );

    const awayTeam = teamsData.teams.find(
        (team) => team.fifa_code === match.team2
    );

    const homePredictions = predictions.filter((p) => {
        const diff =
            p.prediction.team1 - p.prediction.team2;

        return diff > 0;
    }).length;

    const drawPredictions = predictions.filter((p) => {
        return (
            p.prediction.team1 ===
            p.prediction.team2
        );
    }).length;

    const awayPredictions = predictions.filter((p) => {
        const diff =
            p.prediction.team1 - p.prediction.team2;

        return diff < 0;
    }).length;

    const total =
        homePredictions +
        drawPredictions +
        awayPredictions;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    background: "#08131f",
                    color: "white",
                    borderRadius: 1,
                    border: "1px solid rgba(255,255,255,.08)",
                },
            }}
        >
            <DialogTitle
                sx={{
                    background: "linear-gradient(135deg,#00E676,#00BCD4)",
                    color: "white",
                    py: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={3}
                    width="100%"
                >
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            src={homeTeam?.flag}
                            sx={{ width: 56, height: 56 }}
                        />
                        <Typography mt={1} fontWeight={700}>
                            {homeTeam?.name_en ?? match.team1}
                        </Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography fontWeight={800} fontSize={20}>
                            {match.team1} vs {match.team2}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,.75)" }}
                        >
                            Community Predictions
                        </Typography>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            src={awayTeam?.flag}
                            sx={{ width: 56, height: 56 }}
                        />
                        <Typography mt={1} fontWeight={700}>
                            {awayTeam?.name_en ?? match.team2}
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={onClose}
                    sx={{
                        color: "white",
                        position: "absolute",
                        right: 4,
                        top: 4,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <Box mt={2} mb={2} px={2}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Box textAlign="left">
                        <Typography fontWeight={700}>
                            {homeTeam?.name_en}
                        </Typography>

                        <Typography color="#7ADD58">
                            👥 {homePredictions}
                        </Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography fontWeight={700}>
                            Draw
                        </Typography>

                        <Typography color="#D6D6D6">
                            🤝 {drawPredictions}
                        </Typography>
                    </Box>

                    <Box textAlign="right">
                        <Typography fontWeight={700}>
                            {awayTeam?.name_en}
                        </Typography>

                        <Typography color="#BCC2FF">
                            👥 {awayPredictions}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        height: 8,
                        borderRadius: 20,
                        overflow: "hidden",
                        bgcolor: "#202632",
                    }}
                >

                    <Box
                        sx={{
                            width: `${total
                                    ? (homePredictions / total) * 100
                                    : 0
                                }%`,
                            bgcolor: "#7CFC6B",
                        }}
                    />

                    <Box
                        sx={{
                            width: `${total
                                    ? (drawPredictions / total) * 100
                                    : 0
                                }%`,
                            bgcolor: "#D6D6D6",
                        }}
                    />

                    <Box
                        sx={{
                            width: `${total
                                    ? (awayPredictions / total) * 100
                                    : 0
                                }%`,
                            bgcolor: "#9FA8FF",
                        }}
                    />

                </Box>

            </Box>

            <DialogContent sx={{ p: 2 }}>
                {loading && (
                    <Box display="flex" justifyContent="center" py={8}>
                        <CircularProgress
                            size={36}
                            sx={{ color: "#00E676" }}
                        />
                    </Box>
                )}

                {!loading && predictions.length === 0 && (
                    <Box py={8} textAlign="center">
                        <Typography fontWeight={700} fontSize={20}>
                            No predictions yet
                        </Typography>

                        <Typography color="rgba(255,255,255,.55)">
                            Be the first one to predict this match.
                        </Typography>
                    </Box>
                )}

                {!loading &&
                    predictions.map((prediction) => {
                        const isMe = prediction.username === username;

                        return (
                            <Box
                                key={`${prediction.username}_${prediction.matchId}`}
                                sx={{
                                    mb: 1,
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: isMe
                                        ? "rgba(0,230,118,.12)"
                                        : "rgba(255,255,255,.04)",
                                    border: isMe
                                        ? "1px solid rgba(0,230,118,.35)"
                                        : "1px solid rgba(255,255,255,.05)",
                                    transition: ".25s",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        bgcolor: isMe
                                            ? "rgba(0,230,118,.18)"
                                            : "rgba(255,255,255,.07)",
                                    },
                                }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "50%",
                                                bgcolor: isMe ? "#00E676" : "#2196F3",
                                                color: "#fff",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {prediction.username.charAt(0).toUpperCase()}
                                        </Box>

                                        <Box>
                                            <Typography fontWeight={700}>
                                                {prediction.username}
                                                {isMe && " • You"}
                                            </Typography>

                                            <Typography
                                                color="rgba(255,255,255,.5)"
                                                fontSize={13}
                                            >
                                                {prediction.score == null
                                                    ? "Awaiting Result"
                                                    : `${prediction.score} pts`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {match.status === "completed" ? <Box
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            borderRadius: 3,
                                            bgcolor: "#121f2b",
                                            border: "1px solid rgba(255,255,255,.08)",
                                            minWidth: 120,
                                        }}
                                    >
                                        <Typography
                                            textAlign="center"
                                            fontWeight={700}
                                            fontSize={18}
                                        >
                                            {prediction.prediction.team1} : {prediction.prediction.team2}
                                        </Typography>

                                        {prediction.prediction.team1 ===
                                            prediction.prediction.team2 &&
                                            prediction.prediction.penaltyWinner && (() => {

                                                const penaltyTeam = teamsData.teams.find(
                                                    t => t.fifa_code === prediction.prediction.penaltyWinner
                                                );

                                                return (
                                                    <Box
                                                        mt={0.8}
                                                        display="flex"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        gap={0.8}
                                                    >
                                                        <Avatar
                                                            src={penaltyTeam?.flag}
                                                            sx={{
                                                                width: 18,
                                                                height: 18,
                                                            }}
                                                        />

                                                        <Typography
                                                            variant="caption"
                                                            color="#00E676"
                                                            fontWeight={700}
                                                        >
                                                            {prediction.prediction.penaltyWinner} pens
                                                        </Typography>
                                                    </Box>
                                                );
                                            })()}
                                    </Box> :
                                        <Box
                                            sx={{
                                                px: 2,
                                                py: 1.2,
                                                borderRadius: 3,
                                                bgcolor: "rgba(255,255,255,.04)",
                                                border: "1px dashed rgba(255,255,255,.15)",
                                                textAlign: "center",
                                                minWidth: 130,
                                            }}
                                        >
                                            <Typography
                                                fontSize={12}
                                                color="rgba(255,255,255,.55)"
                                            >
                                                🔒 Hidden
                                            </Typography>

                                            {/* <Typography
                                                variant="caption"
                                                color="rgba(255,255,255,.35)"
                                            >
                                                Revealed after full time
                                            </Typography> */}
                                        </Box>
                                    }

                                </Box>
                            </Box>
                        );
                    })}
            </DialogContent>
        </Dialog>
    );
}