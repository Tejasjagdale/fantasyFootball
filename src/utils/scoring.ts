export function calculateScore(
    actualHome:number,
    actualAway:number,
    predictedHome:number,
    predictedAway:number
){

    // Jackpot
    if(
        actualHome===predictedHome &&
        actualAway===predictedAway
    ){
        return 5;
    }

    let score=0;

    const actualDiff=
        actualHome-actualAway;

    const predictedDiff=
        predictedHome-predictedAway;

    const actualOutcome=
        Math.sign(actualDiff);

    const predictedOutcome=
        Math.sign(predictedDiff);

    // Winner
    if(actualOutcome===predictedOutcome){
        score+=2;
    }

    // Goal difference
    if(actualDiff===predictedDiff){
        score+=2;
    }

    // Team score

    if(actualHome===predictedHome){
        score+=1;
    }

    if(actualAway===predictedAway){
        score+=1;
    }

    return score;

}
