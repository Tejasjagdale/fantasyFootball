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

    const sortedPredictions = [...predictions].sort(
        (a, b) => (b.score ?? 0) - (a.score ?? 0)
    );

    const highestScore =
        sortedPredictions.length > 0
            ? sortedPredictions[0].score ?? 0
            : 0;

    // Only declare winners if someone scored at least 2 points
    const winners =
        highestScore >= 2
            ? sortedPredictions.filter(
                p => (p.score ?? 0) === highestScore
            )
            : [];

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
                    position: "relative",
                    overflow: "hidden",
                    background:
                        "linear-gradient(135deg,#0F172A 0%,#1E293B 45%,#111827 100%)",
                    color: "white",
                    py: 2,
                    px: 3,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(18px)",

                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at top left, rgba(0,255,170,.18), transparent 45%), radial-gradient(circle at bottom right, rgba(0,140,255,.18), transparent 45%)",
                        pointerEvents: "none",
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                    }}
                >
                    {/* Home Team */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{ width: 110 }}
                    >
                        <Avatar
                            src={homeTeam?.flag}
                            sx={{
                                width: 54,
                                height: 54,
                                bgcolor: "#fff",
                                p: 0,
                                boxShadow: "0 0 18px rgba(0,230,118,.35)",
                                border: "2px solid rgba(255,255,255,.15)",
                            }}
                        />
                        <Typography
                            mt={1}
                            fontWeight={700}
                            fontSize={13}
                            textAlign="center"
                            noWrap
                        >
                            {homeTeam?.name_en ?? match.team1}
                        </Typography>
                    </Box>

                    {/* Center */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box
                            sx={{
                                width: 54,
                                height: 54,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "linear-gradient(135deg,#00E676,#00BCD4)",
                                color: "#fff",
                                fontWeight: 900,
                                fontSize: 16,
                                letterSpacing: 1,
                                boxShadow: "0 8px 24px rgba(0,188,212,.45)",
                                border: "2px solid rgba(255,255,255,.12)",
                            }}
                        >
                            VS
                        </Box>

                        <Typography
                            mt={1.2}
                            fontWeight={800}
                            fontSize={17}
                            letterSpacing={0.3}
                        >
                            {match.team1}{" "}
                            <span style={{ opacity: 0.55 }}>vs</span>{" "}
                            {match.team2}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.3,
                                fontSize: 11,
                                color: "rgba(255,255,255,.65)",
                                textTransform: "uppercase",
                                letterSpacing: 1.2,
                            }}
                        >
                            Community Predictions
                        </Typography>
                    </Box>

                    {/* Away Team */}
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{ width: 110 }}
                    >
                        <Avatar
                            src={awayTeam?.flag}
                            sx={{
                                width: 54,
                                height: 54,
                                bgcolor: "#fff",
                                p: 0,
                                boxShadow: "0 0 18px rgba(0,188,212,.35)",
                                border: "2px solid rgba(255,255,255,.15)",
                            }}
                        />
                        <Typography
                            mt={1}
                            fontWeight={700}
                            fontSize={13}
                            textAlign="center"
                            noWrap
                        >
                            {awayTeam?.name_en ?? match.team2}
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        width: 34,
                        height: 34,
                        color: "#fff",
                        background: "rgba(255,255,255,.08)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,.08)",
                        transition: ".25s",
                        "&:hover": {
                            background: "rgba(255,255,255,.16)",
                            transform: "rotate(90deg)",
                        },
                    }}
                >
                    <CloseIcon fontSize="small" />
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

                {match.status === "completed" && (<Box
                    sx={{
                        mb: 2,
                        px: 2.5,
                        py: 2,
                        borderRadius: 3,
                        background: "linear-gradient(180deg,#182432,#101720)",
                        border:
                            winners.length > 0
                                ? "1px solid rgba(255,215,0,.18)"
                                : "1px solid rgba(255,255,255,.08)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            bgcolor:
                                winners.length > 0
                                    ? "#FFC107"
                                    : "#607D8B",
                        }}
                    />

                    {winners.length > 0 ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Typography fontSize={30}>🏆</Typography>

                                <Box>
                                    <Typography fontWeight={700} color="white">
                                        {winners.length === 1
                                            ? "Prediction Champion"
                                            : "Joint Winners"}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: "rgba(255,255,255,.65)" }}
                                    >
                                        {winners.map(w => w.username).join(" • ")}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    px: 1,
                                    py: .6,
                                    borderRadius: 10,
                                    bgcolor: "rgba(255,193,7,.12)",
                                    border: "1px solid rgba(255,193,7,.35)",
                                }}
                            >
                                <Typography
                                    fontWeight={600}
                                    color="#FFD54F"
                                >
                                    ⭐ {highestScore}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Typography fontSize={30}>⚖️</Typography>

                                <Box>
                                    <Typography
                                        fontWeight={700}
                                        color="white"
                                    >
                                        No Winner
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: "rgba(255,255,255,.65)" }}
                                    >
                                        Nobody scored enough points for this match.
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography
                                sx={{
                                    color: "rgba(255,255,255,.45)",
                                    fontWeight: 700,
                                }}
                            >
                                —
                            </Typography>
                        </Box>
                    )}
                </Box>)}

                {!loading &&
                    sortedPredictions.map((prediction) => {
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
                                    {match.status === "completed" || match.status === "locked" ? <Box
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