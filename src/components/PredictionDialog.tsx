import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography,
    Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
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
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,.08)",
                },
            }}
        >

            <DialogTitle
                sx={{
                    background:
                        "linear-gradient(135deg,#00E676,#00BCD4)",
                    color: "white",
                    py: 3,
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
                        {match?.team1} vs {match?.team2}
                    </Typography>

                    <Typography
                        sx={{
                            opacity: .85,
                        }}
                    >
                        Community Predictions
                    </Typography>
                </Box>

                <IconButton
                    onClick={onClose}
                    sx={{
                        color: "white",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>



            <Divider />


            <DialogContent sx={{ p: 3 }}>

                {loading && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        py={8}
                    >
                        <CircularProgress
                            size={36}
                            sx={{ color: "#00E676" }}
                        />
                    </Box>
                )}

                {!loading && predictions.length === 0 && (
                    <Box
                        py={8}
                        textAlign="center"
                    >
                        <Typography
                            fontWeight={700}
                            fontSize={20}
                        >
                            No predictions yet
                        </Typography>

                        <Typography
                            color="rgba(255,255,255,.55)"
                        >
                            Be the first one to predict this match.
                        </Typography>
                    </Box>
                )}

                {!loading &&
                    predictions.map((prediction) => {

                        const isMe =
                            prediction.username === username;

                        return (

                            <Box
                                key={`${prediction.username}_${prediction.matchId}`}
                                sx={{
                                    mb: 2,
                                    p: 2.5,
                                    borderRadius: 3,
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

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                    >

                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "50%",
                                                bgcolor: isMe
                                                    ? "#00E676"
                                                    : "#2196F3",

                                                color: "#fff",

                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",

                                                fontWeight: 700,
                                            }}
                                        >
                                            {prediction.username
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Box>

                                        <Box>

                                            <Typography
                                                fontWeight={700}
                                            >
                                                {prediction.username}

                                                {isMe &&
                                                    " • You"}
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

                                    <Box
                                        sx={{
                                            px: 2,
                                            py: .8,
                                            borderRadius: 50,
                                            bgcolor: "#121f2b",
                                            border:
                                                "1px solid rgba(255,255,255,.08)",

                                            fontWeight: 700,
                                            fontSize: 18,
                                            minWidth: 80,
                                            textAlign: "center",
                                        }}
                                    >
                                        {prediction.prediction.team1}

                                        {" : "}

                                        {prediction.prediction.team2}
                                    </Box>

                                </Box>

                            </Box>

                        );

                    })}

            </DialogContent>


        </Dialog>
    );
}
