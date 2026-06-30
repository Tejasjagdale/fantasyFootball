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

    // Determine actual winner
    const actualWinner = isActualDraw
        ? actualPenaltyWinner
        : actualHome > actualAway
            ? "HOME"
            : "AWAY";

    // Determine predicted winner
    const predictedWinner = isPredictedDraw
        ? predictedPenaltyWinner
        : predictedHome > predictedAway
            ? "HOME"
            : "AWAY";

    let score = 0;

    const winnerCorrect = actualWinner === predictedWinner;

    // 1. Correct winner
    if (winnerCorrect) {
        score += 2;

        // 2. Correct goal difference (only if winner is correct)
        const actualGoalDifference = Math.abs(actualHome - actualAway);
        const predictedGoalDifference = Math.abs(predictedHome - predictedAway);

        if (actualGoalDifference === predictedGoalDifference) {
            score += 2;
        }
    }

    // 3. Exact home/team 1 score
    if (actualHome === predictedHome) {
        score += 1;
    }

    // 4. Exact away/team 2 score
    if (actualAway === predictedAway) {
        score += 1;
    }

    return score;
}