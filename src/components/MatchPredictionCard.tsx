import {
    Alert,
    Box,
    Button,
    Typography,
} from "@mui/material";

import MatchCard from "./MatchCard";
import type { Match } from "../services/matchService";

interface Props {
    match: Match;

    prediction?: {
        home: number;
        away: number;
        penaltyWinner: string | null;
    };

    submitted: boolean;

    saving: boolean;

    error?: string;

    onHomeScoreChange: (score: number) => void;

    onAwayScoreChange: (score: number) => void;

    onSubmit: () => Promise<void> | void;

    onViewPredictions: () => void;
}

export default function MatchPredictionCard({
    match,
    prediction,
    submitted,
    saving,
    error,
    onHomeScoreChange,
    onAwayScoreChange,
    onSubmit,
    onViewPredictions,
}: Props) {

    const requiresPenaltyWinner =
        prediction &&
        prediction.home === prediction.away;

    const penaltySelected =
        !!prediction?.penaltyWinner;

    return (
        <Box
            width="100%"
            maxWidth={650}
        >
            <MatchCard
                homeTeam={match.team1}
                awayTeam={match.team2}
                disabled={submitted}
                homeScore={prediction?.home ?? 0}
                awayScore={prediction?.away ?? 0}
                onHomeScoreChange={onHomeScoreChange}
                onAwayScoreChange={onAwayScoreChange}
                penaltyWinner={prediction?.penaltyWinner ?? null}

                onPenaltyWinnerChange={(team) =>
                    onPenaltyWinnerChange(team)
                }
            />

            <Box
                mt={2}
                display="flex"
                flexDirection="column"
                gap={1}
            >
                {!submitted && (
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        disabled={
                            saving ||
                            submitted ||
                            match.status.toLowerCase() === "completed" ||
                            (requiresPenaltyWinner && !penaltySelected)
                        }
                        onClick={onSubmit}
                        sx={{
                            borderRadius: 3,
                            py: 1.3,
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: 16,
                        }}
                    >
                        {saving
                            ? "Submitting..."
                            : "Submit Prediction"}
                    </Button>
                )}

                {submitted && (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onViewPredictions}
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                        }}
                    >
                        View everyone's predictions
                    </Button>
                )}

                {submitted && (
                    <Alert severity="success">
                        Prediction submitted successfully.
                    </Alert>
                )}

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {match.status.toLowerCase() === "completed" &&
                    match.result && (
                        <Alert severity="info">
                            Final Score

                            <Typography
                                mt={1}
                                fontWeight={700}
                            >
                                {match.team1}{" "}
                                {match.result.team1}

                                {"  -  "}

                                {match.result.team2}{" "}

                                {match.team2}
                            </Typography>
                        </Alert>
                    )}
            </Box>
        </Box>
    );
}