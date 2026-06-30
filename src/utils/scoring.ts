export function calculateScore(
  actualHome: number,
  actualAway: number,
  actualPenaltyWinner: string | null,
  predictedHome: number,
  predictedAway: number,
  predictedPenaltyWinner: string | null,
  team1: string,
  team2: string
) {
  const isActualDraw = actualHome === actualAway;
  const isPredictedDraw = predictedHome === predictedAway;

  // Determine actual winner
  const actualWinner = isActualDraw
    ? actualPenaltyWinner
    : actualHome > actualAway
      ? team1
      : team2;

  // Determine predicted winner
  const predictedWinner = isPredictedDraw
    ? predictedPenaltyWinner
    : predictedHome > predictedAway
      ? team1
      : team2;

  let score = 0;

  // 1. Correct winner
  if (actualWinner === predictedWinner) {
    score += 2;
  }

  // 2. Correct goal difference (signed)
  const actualGoalDifference = actualHome - actualAway;
  const predictedGoalDifference = predictedHome - predictedAway;

  if (actualGoalDifference === predictedGoalDifference) {
    score += 2;
  }

  // 3. Correct home goals
  if (actualHome === predictedHome) {
    score += 1;
  }

  // 4. Correct away goals
  if (actualAway === predictedAway) {
    score += 1;
  }

  return score;
}