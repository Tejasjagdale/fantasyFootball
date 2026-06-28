export function calculateScore(
    actualHome: number,
    actualAway: number,
    actualPenaltyWinner: string | null,
    predictedHome: number,
    predictedAway: number,
    predictedPenaltyWinner: string | null
) {
    const isActualDraw = actualHome === actualAway;
    const isPredictedDraw = predictedHome === predictedAway;

    // Perfect prediction
    if (
        actualHome === predictedHome &&
        actualAway === predictedAway &&
        (
            !isActualDraw ||
            actualPenaltyWinner === predictedPenaltyWinner
        )
    ) {
        return 6;
    }

    let score = 0;

    // Winner
    if (isActualDraw) {
        if (
            isPredictedDraw &&
            actualPenaltyWinner === predictedPenaltyWinner
        ) {
            score += 2;
        }
    } else {
        const actualOutcome = Math.sign(actualHome - actualAway);
        const predictedOutcome = Math.sign(predictedHome - predictedAway);

        if (actualOutcome === predictedOutcome) {
            score += 2;
        }
    }

    // Goal Difference
    if (
        !isActualDraw &&
        (actualHome - actualAway) === (predictedHome - predictedAway)
    ) {
        score += 2;
    }

    // Exact team scores
    if (actualHome === predictedHome) {
        score += 1;
    }

    if (actualAway === predictedAway) {
        score += 1;
    }

    return score;
}