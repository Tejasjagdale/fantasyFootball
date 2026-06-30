/* eslint-disable react-hooks/static-components */
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

import teams from "../data/teams.json";
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

    onHomeScoreChange: (score: number) => void;
    onAwayScoreChange: (score: number) => void;
    onPenaltyWinnerChange: (winner: string | null) => void;

    onSubmit: () => Promise<void> | void;
    onRevokePrediction: () => Promise<void> | void;
    onViewPredictions: () => void;
}

export default function MatchPredictionCard({
    match,
    prediction,
    submitted,
    saving,
    onHomeScoreChange,
    onAwayScoreChange,
    onPenaltyWinnerChange,
    onSubmit,
    onRevokePrediction,
    onViewPredictions,
}: Props) {

    const home =
        prediction?.home ?? 0;

    const away =
        prediction?.away ?? 0;

    const disabled =
        submitted ||
        match.status !== "upcoming";

    const draw =
        home === away;

    const homeTeam =
        teams.teams.find(
            t => t.fifa_code === match.team1
        );

    const awayTeam =
        teams.teams.find(
            t => t.fifa_code === match.team2
        );

    const StatusChip = () => {

        switch (match.status) {

            case "completed":

                return (
                    <Chip
                        size="small"
                        label="Completed"
                        color="success"
                    />
                );

            case "locked":

                return (
                    <Chip
                        size="small"
                        label="Locked"
                        color="warning"
                    />
                );

            default:

                return (
                    <Chip
                        size="small"
                        label="Open"
                        color="primary"
                    />
                );

        }

    };

    const ScoreBox = ({
        value,
        disabled,
        increment,
        decrement,
    }: {
        value: number;
        disabled: boolean;
        increment: () => void;
        decrement: () => void;
    }) => (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
                px: 1.5,
                py: 1,
                borderRadius: 3,
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.08)",
            }}
        >
            <IconButton
                size="small"
                disabled={disabled || value === 0}
                onClick={decrement}
            >
                <RemoveRoundedIcon />
            </IconButton>

            <Typography
                sx={{
                    width: 26,
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: 26,
                }}
            >
                {value}
            </Typography>

            <IconButton
                size="small"
                disabled={disabled}
                onClick={increment}
            >
                <AddRoundedIcon />
            </IconButton>
        </Stack>
    );

    return (

        <Card
            elevation={0}
            sx={{

                maxWidth: 800,
                borderRadius: 2,

                background:
                    "linear-gradient(180deg,#132033,#0c1725)",

                border: "1px solid rgba(255,255,255,.08)",

                backdropFilter: "blur(12px)"

            }}
        >

            <CardContent>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={1.5}

                >

                    <Typography
                        fontWeight={800}
                        fontSize={18}
                    >

                        Match

                    </Typography>

                    <StatusChip />

                </Stack>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                >

                    <Stack
                        alignItems="center"
                        spacing={1}
                        width={120}
                    >

                        <Avatar

                            src={homeTeam?.flag}

                            sx={{

                                width: 42,

                                height: 42,

                                boxShadow:
                                    "0 0 15px rgba(255,255,255,.15)"

                            }}

                        >

                            {match.team1}

                        </Avatar>

                        <Typography
                            fontWeight={700}
                        >

                            {match.team1}

                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            {homeTeam?.name_en}

                        </Typography>

                    </Stack>

                    <Typography

                        fontSize={22}

                        fontWeight={900}

                    >

                        VS

                    </Typography>

                    <Stack
                        alignItems="center"
                        spacing={1}
                        width={120}
                    >

                        <Avatar

                            src={awayTeam?.flag}

                            sx={{

                                width: 42,

                                height: 42,

                                boxShadow:
                                    "0 0 15px rgba(255,255,255,.15)"

                            }}

                        >

                            {match.team2}

                        </Avatar>

                        <Typography
                            fontWeight={700}
                        >

                            {match.team2}

                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >

                            {awayTeam?.name_en}

                        </Typography>

                    </Stack>

                </Stack>

                <Box mt={2} />

                <Stack

                    direction="row"

                    justifyContent="center"

                    alignItems="center"

                    spacing={3}

                >

                    <ScoreBox

                        value={home}

                        disabled={disabled}

                        increment={() =>
                            onHomeScoreChange(home + 1)
                        }

                        decrement={() =>
                            onHomeScoreChange(home - 1)
                        }

                    />

                    <Typography
                        fontSize={32}
                        fontWeight={900}
                    >

                        :

                    </Typography>

                    <ScoreBox

                        value={away}

                        disabled={disabled}

                        increment={() =>
                            onAwayScoreChange(away + 1)
                        }

                        decrement={() =>
                            onAwayScoreChange(away - 1)
                        }

                    />

                </Stack>

                {draw && (

                    <Box mt={2}>

                        <Typography

                            textAlign="center"

                            fontWeight={700}

                            mb={2}

                        >

                            Penalty Winner

                        </Typography>

                        <Stack

                            direction="row"

                            spacing={2}

                            justifyContent="center"

                        >
                            {[
                                {
                                    team: match.team1,
                                    flag: homeTeam?.flag,
                                    selected:
                                        prediction?.penaltyWinner === match.team1
                                },
                                {
                                    team: match.team2,
                                    flag: awayTeam?.flag,
                                    selected:
                                        prediction?.penaltyWinner === match.team2
                                }
                            ].map((item) => (

                                <Box
                                    key={item.team}
                                    onClick={() => {
                                        if (disabled) return;
                                        onPenaltyWinnerChange(item.team);
                                    }}
                                    sx={{

                                        cursor:
                                            disabled ? "default" : "pointer",

                                        borderRadius: 4,

                                        px: 2,

                                        py: 1.2,

                                        display: "flex",

                                        alignItems: "center",

                                        gap: 1.2,

                                        transition: "all .25s",

                                        border: item.selected
                                            ? "2px solid #4CAF50"
                                            : "1px solid rgba(255,255,255,.08)",

                                        background: item.selected
                                            ? "linear-gradient(135deg,#1B5E20,#2E7D32)"
                                            : "rgba(255,255,255,.04)",

                                        "&:hover": {
                                            transform:
                                                disabled
                                                    ? "none"
                                                    : "translateY(-2px)",
                                            background:
                                                disabled
                                                    ? undefined
                                                    : "rgba(255,255,255,.08)"
                                        }

                                    }}

                                >

                                    <Avatar
                                        src={item.flag}
                                        sx={{
                                            width: 28,
                                            height: 28
                                        }}
                                    />

                                    <Typography
                                        fontWeight={700}
                                    >

                                        {item.team}

                                    </Typography>

                                </Box>

                            ))}

                        </Stack>

                    </Box>

                )}

                {match.status === "completed" &&
                    match.result && (

                        <>

                            <Divider
                                sx={{
                                    my: 2
                                }}
                            />

                            <Box
                                textAlign="center"
                            >

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >

                                    FINAL RESULT

                                </Typography>

                                <Typography
                                    fontSize={32}
                                    fontWeight={900}
                                    mt={0.5}
                                >

                                    {match.result.team1}
                                    {" : "}
                                    {match.result.team2}

                                </Typography>

                                {match.result.penaltyWinner && (

                                    <Stack

                                        direction="row"

                                        justifyContent="center"

                                        spacing={1}

                                        mt={1}

                                    >

                                        <EmojiEventsRoundedIcon
                                            color="warning"
                                        />

                                        <Typography
                                            fontWeight={700}
                                        >

                                            {match.result.penaltyWinner}
                                             won on penalties

                                        </Typography>

                                    </Stack>

                                )}

                            </Box>

                        </>

                    )}

                <Divider
                    sx={{
                        my: 2
                    }}
                />

                <Stack
                    direction="row"
                    spacing={2}
                >

                    <Button
                        fullWidth
                        size="large"
                        variant={
                            submitted
                                ? "outlined"
                                : "contained"
                        }
                        disabled={
                            submitted ||
                            saving ||
                            match.status !== "upcoming" ||
                            (draw && !prediction?.penaltyWinner)
                        }
                        startIcon={
                            submitted
                                ? <CheckCircleRoundedIcon />
                                : undefined
                        }
                        onClick={onSubmit}
                        sx={{
                            borderRadius: 3,
                            fontWeight: 700,
                            textTransform: "none",
                            height: 48,
                        }}
                    >
                        {submitted
                            ? "Submitted"
                            : saving
                                ? "Submitting..."
                                : "Submit Prediction"}
                    </Button>

                    {submitted && (
                        <Button
                            variant="outlined"
                            startIcon={<GroupsRoundedIcon />}
                            onClick={onViewPredictions}
                            sx={{
                                borderRadius: 3,
                                textTransform: "none",
                                minWidth: 110,
                            }}
                        >
                            View
                        </Button>
                    )}

                    {submitted &&
                        match.status === "upcoming" && (
                            <Button
                                color="error"
                                variant="outlined"
                                onClick={onRevokePrediction}
                                sx={{
                                    borderRadius: 3,
                                    textTransform: "none",
                                    minWidth: 110,
                                }}
                            >
                                Revoke
                            </Button>
                        )}

                </Stack>
                {match.status === "locked" && (

                    <Box
                        mt={3}
                        textAlign="center"
                    >

                        <Typography
                            variant="body2"
                            color="warning.main"
                            fontWeight={600}
                        >

                            Predictions are locked for this match.

                        </Typography>

                    </Box>

                )}

            </CardContent>

        </Card>

    );

}