import { Match, CommentaryBall } from '../types/cricket';
import { playBatStrikeSound, playBoundarySound, playSixSound, playWicketSound } from './audioFeedback';

export interface SimulationResult {
  updatedMatch: Match;
  eventHeadline: string;
  eventType: 'dot' | 'single' | 'two' | 'three' | 'four' | 'six' | 'wicket' | 'wide' | 'noball';
}

const SHOT_DESCRIPTIONS = {
  four: [
    'Glorious cover drive! Pierces the gap between extra cover and mid-off, racing to the ropes.',
    'Flayed through backward point! Opened the face of the bat and beat the diving fielder.',
    'Whipped off the hips! Sensational wrist-work sending the ball to the square leg boundary.',
    'Cracked down the ground past the bowler! Mid-on and mid-off had no chance to chase that down.',
    'Short ball pulled away viciously! Hits the turf twice and smashes into the boundary cushions.',
  ],
  six: [
    'BOOM! Launched high into the second tier over long-on! Massive hit, crowd goes wild!',
    'Pick-up shot of supreme beauty! Clears the deep mid-wicket ropes with effortless elegance.',
    'Stands and delivers! Lofted cleanly over the bowler’s head, sailing straight back into the stands.',
    'Hooked with authority over deep fine leg! Maximum into the delirious grandstand!',
    'Dancing down the track, gets to the pitch and lofts it inside-out over deep extra cover!',
  ],
  wicket: [
    'OUT! Edged and taken! Sharp seam movement off the deck, kisses the outside edge into keeper’s gloves!',
    'TIMBER! Castled him! Searing yorker sneaks beneath the flashing blade, shattering the stumps!',
    'GONE! Caught in the deep! Tries to go over long-on, mistimes it high and straight into waiting hands.',
    'APPEAL AND GIVEN! Plumb in front! Rapid full ball thuds into the back pad, umpire raises the finger.',
    'RUN OUT! Direct hit! Hesitation between the wickets, fielder picks and throws in one fluid motion!',
  ],
  single: [
    'Pushed softly into the cover region for a brisk single.',
    'Tucked off the pads behind square, easy run taken.',
    'Dabbed down to third man with soft hands, rotates the strike.',
    'Driven down to long-on, batters jog through comfortably.',
  ],
  dot: [
    'Good length ball around fifth stump, left alone cautiously into the keeper’s gloves.',
    'Beaten by the seam! Jags back in sharply, beats the inside edge.',
    'Solid defensive block right out of the meat of the willow.',
    'Fired in flat on off stump, tapped straight back to the bowler.',
  ],
};

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function simulateBall(match: Match): SimulationResult {
  if (match.status !== 'LIVE') {
    return { updatedMatch: match, eventHeadline: 'Match is not currently live', eventType: 'dot' };
  }

  // Determine current over details
  const [striker, nonStriker] = match.currentBatters;
  const bowler = { ...match.currentBowler };

  // Calculate current over & ball
  const totalBallsInOver = match.currentOverDeliveries.filter(d => d.code !== '1wd' && d.code !== '1nb').length;
  const isOverFinished = totalBallsInOver >= 6;

  let currentOverNum = Math.floor(bowler.overs);
  let ballInOver = totalBallsInOver + 1;

  if (isOverFinished) {
    currentOverNum += 1;
    ballInOver = 1;
  }

  // Outcome probabilities tailored to match format and situation
  const isT20 = match.format === 'T20';
  const rand = Math.random();

  let outcome: 'dot' | 'single' | 'two' | 'three' | 'four' | 'six' | 'wicket' | 'wide' = 'dot';
  let runs = 0;
  let code = '0';
  let headline = '';
  let detail = '';
  const bowlerSpeed = Number((135 + Math.random() * 12).toFixed(1));

  if (isT20) {
    if (rand < 0.26) {
      outcome = 'dot';
      runs = 0;
      code = '0';
      headline = `${striker.name} plays defensively: dot ball`;
      detail = getRandom(SHOT_DESCRIPTIONS.dot);
      playBatStrikeSound('soft');
    } else if (rand < 0.56) {
      outcome = 'single';
      runs = 1;
      code = '1';
      headline = `${striker.name} picks a sharp single`;
      detail = getRandom(SHOT_DESCRIPTIONS.single);
      playBatStrikeSound('medium');
    } else if (rand < 0.68) {
      outcome = 'two';
      runs = 2;
      code = '2';
      headline = `Hard running between wickets for two`;
      detail = 'Pushed into the deep pocket, electric running turns one into two.';
      playBatStrikeSound('medium');
    } else if (rand < 0.80) {
      outcome = 'four';
      runs = 4;
      code = '4';
      headline = `FOUR! ${striker.name} finds the rope in style!`;
      detail = getRandom(SHOT_DESCRIPTIONS.four);
      playBoundarySound();
    } else if (rand < 0.89) {
      outcome = 'six';
      runs = 6;
      code = '6';
      headline = `SIX! ${striker.name} clears the boundary ropes!`;
      detail = getRandom(SHOT_DESCRIPTIONS.six);
      playSixSound();
    } else if (rand < 0.94) {
      outcome = 'wide';
      runs = 1;
      code = '1wd';
      headline = `Wide ball bowled down the leg side`;
      detail = 'Fired down leg, keeper dives to gather. Umpire signals wide extra.';
      bowler.wides += 1;
    } else {
      outcome = 'wicket';
      runs = 0;
      code = 'W';
      headline = `WICKET! ${bowler.name} breaks through, dismissing ${striker.name}!`;
      detail = getRandom(SHOT_DESCRIPTIONS.wicket);
      playWicketSound();
    }
  } else {
    // Test match scenario
    if (rand < 0.42) {
      outcome = 'dot';
      runs = 0;
      code = '0';
      headline = `Solid forward defence by ${striker.name}`;
      detail = getRandom(SHOT_DESCRIPTIONS.dot);
      playBatStrikeSound('soft');
    } else if (rand < 0.72) {
      outcome = 'single';
      runs = 1;
      code = '1';
      headline = `${striker.name} nudges down for a single`;
      detail = getRandom(SHOT_DESCRIPTIONS.single);
      playBatStrikeSound('medium');
    } else if (rand < 0.81) {
      outcome = 'two';
      runs = 2;
      code = '2';
      headline = `Clipped into the gap for a brace`;
      detail = 'Driven gently through mid-wicket, fine running gives two runs.';
      playBatStrikeSound('medium');
    } else if (rand < 0.89) {
      outcome = 'four';
      runs = 4;
      code = '4';
      headline = `FOUR! Glorious stroke by ${striker.name}!`;
      detail = getRandom(SHOT_DESCRIPTIONS.four);
      playBoundarySound();
    } else if (rand < 0.93) {
      outcome = 'six';
      runs = 6;
      code = '6';
      headline = `SIX! Aggression rewarded for ${striker.name}!`;
      detail = getRandom(SHOT_DESCRIPTIONS.six);
      playSixSound();
    } else if (rand < 0.96) {
      outcome = 'wide';
      runs = 1;
      code = '1wd';
      headline = `Wide ball down the leg side`;
      detail = 'Spills down the leg side past the batter, signaled wide.';
      bowler.wides += 1;
    } else {
      outcome = 'wicket';
      runs = 0;
      code = 'W';
      headline = `WICKET! Huge moment! ${striker.name} falls to ${bowler.name}!`;
      detail = getRandom(SHOT_DESCRIPTIONS.wicket);
      playWicketSound();
    }
  }

  // Update batter stats
  let updatedStriker = { ...striker };
  let updatedNonStriker = { ...nonStriker };

  if (outcome === 'wicket') {
    updatedStriker.isOut = true;
    updatedStriker.balls += 1;
    updatedStriker.dismissal = `c & b ${bowler.name}`;
    updatedStriker.strikeRate = Number(((updatedStriker.runs / updatedStriker.balls) * 100).toFixed(2));

    // Next batter comes in
    const bench = match.squads.teamA.find(p => p.name !== striker.name && p.name !== nonStriker.name && !match.innings[match.innings.length - 1]?.batting.some(b => b.name === p.name));
    const nextBatterName = bench ? bench.name : 'Incoming Batter';
    
    updatedStriker = {
      id: `bat-${Date.now()}`,
      name: nextBatterName,
      dismissal: 'batting',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0.0,
      isOut: false,
      isOnStrike: true,
    };
  } else {
    updatedStriker.balls += 1;
    updatedStriker.runs += runs;
    if (outcome === 'four') updatedStriker.fours += 1;
    if (outcome === 'six') updatedStriker.sixes += 1;
    updatedStriker.strikeRate = Number(((updatedStriker.runs / updatedStriker.balls) * 100).toFixed(2));
  }

  // Update bowler stats
  const isLegalBall = outcome !== 'wide';
  if (isLegalBall) {
    const prevBowlerBalls = Math.floor(bowler.overs) * 6 + Math.round((bowler.overs % 1) * 10);
    const newTotalBalls = prevBowlerBalls + 1;
    const newOvers = Math.floor(newTotalBalls / 6) + (newTotalBalls % 6) / 10;
    bowler.overs = Number(newOvers.toFixed(1));
    if (outcome === 'dot') bowler.dots += 1;
  }
  bowler.runs += runs;
  if (outcome === 'wicket') bowler.wickets += 1;
  const totalBowlerOversCount = Math.floor(bowler.overs) + (bowler.overs % 1) * (10 / 6);
  bowler.economy = totalBowlerOversCount > 0 ? Number((bowler.runs / totalBowlerOversCount).toFixed(2)) : 0;

  // Determine strike rotation
  let rotateStrike = runs % 2 === 1;
  const isEndOfOver = ballInOver === 6;

  if (isEndOfOver) {
    rotateStrike = !rotateStrike; // End of over inverts strike change
  }

  let finalCurrentBatters: [typeof striker, typeof nonStriker];
  if (rotateStrike) {
    updatedStriker.isOnStrike = false;
    updatedNonStriker.isOnStrike = true;
    finalCurrentBatters = [updatedNonStriker, updatedStriker];
  } else {
    updatedStriker.isOnStrike = true;
    updatedNonStriker.isOnStrike = false;
    finalCurrentBatters = [updatedStriker, updatedNonStriker];
  }

  // Update Team A scores
  const newTeamRuns = match.teamA.currentRuns + runs;
  const newTeamWickets = match.teamA.currentWickets + (outcome === 'wicket' ? 1 : 0);
  const totalTeamBalls = Math.floor(match.teamA.currentOvers) * 6 + Math.round((match.teamA.currentOvers % 1) * 10) + (isLegalBall ? 1 : 0);
  const newTeamOvers = Number((Math.floor(totalTeamBalls / 6) + (totalTeamBalls % 6) / 10).toFixed(1));

  // Current over delivery bubble
  const newDelivery = {
    ball: ballInOver,
    code,
    runs,
    isWicket: outcome === 'wicket',
    isBoundary: outcome === 'four' || outcome === 'six',
  };

  const updatedCurrentOver = isOverFinished ? [newDelivery] : [...match.currentOverDeliveries, newDelivery];

  // Commentary entry
  const overString = `${currentOverNum}.${ballInOver}`;
  const newCommentaryItem: CommentaryBall = {
    id: `comm-${Date.now()}`,
    over: overString,
    ballNumber: ballInOver,
    bowlerName: bowler.name,
    batterName: updatedStriker.name,
    runs,
    outcomeType: outcome,
    shortText: code,
    headline,
    detail,
    speedKmh: bowlerSpeed,
    timestamp: 'Just now',
  };

  // Win probability calculation
  const situation = match.currentSituation ? { ...match.currentSituation } : undefined;
  if (situation && situation.runsRequired !== undefined && situation.ballsRemaining !== undefined) {
    situation.runsRequired = Math.max(0, situation.runsRequired - runs);
    if (isLegalBall) {
      situation.ballsRemaining = Math.max(0, situation.ballsRemaining - 1);
    }
    situation.currentRunRate = Number(((newTeamRuns / (totalTeamBalls / 6))).toFixed(2));
    if (situation.ballsRemaining > 0) {
      situation.requiredRunRate = Number(((situation.runsRequired / (situation.ballsRemaining / 6))).toFixed(2));
    }

    // Win probability shift
    if (outcome === 'wicket') {
      situation.winProbability.teamA = Math.max(5, situation.winProbability.teamA - 14);
      situation.winProbability.teamB = Math.min(95, 100 - situation.winProbability.teamA - (situation.winProbability.draw || 0));
    } else if (outcome === 'four' || outcome === 'six') {
      situation.winProbability.teamA = Math.min(96, situation.winProbability.teamA + (outcome === 'six' ? 8 : 5));
      situation.winProbability.teamB = Math.max(4, 100 - situation.winProbability.teamA - (situation.winProbability.draw || 0));
    } else if (situation.runsRequired <= 0) {
      situation.winProbability.teamA = 100;
      situation.winProbability.teamB = 0;
    }
  }

  // Update the current innings scorecard
  const updatedInnings = match.innings.map(inn => {
    if (!inn.isCurrent) return inn;
    const updatedBatting = inn.batting.map(b => {
      if (b.name === striker.name) {
        return updatedStriker;
      }
      return b;
    });

    const updatedBowling = inn.bowling.map(bow => {
      if (bow.name === bowler.name) {
        return bowler;
      }
      return bow;
    });

    return {
      ...inn,
      runs: newTeamRuns,
      wickets: newTeamWickets,
      overs: newTeamOvers,
      batting: updatedBatting,
      bowling: updatedBowling,
    };
  });

  const updatedMatch: Match = {
    ...match,
    teamA: {
      ...match.teamA,
      currentRuns: newTeamRuns,
      currentWickets: newTeamWickets,
      currentOvers: newTeamOvers,
      score: match.teamA.score.includes('&')
        ? `${match.teamA.score.split('&')[0]}& ${newTeamRuns}/${newTeamWickets}`
        : `${newTeamRuns}/${newTeamWickets} (${newTeamOvers} ov)`,
    },
    currentBatters: finalCurrentBatters,
    currentBowler: bowler,
    currentOverDeliveries: updatedCurrentOver,
    commentary: [newCommentaryItem, ...match.commentary],
    currentSituation: situation,
    innings: updatedInnings,
  };

  return {
    updatedMatch,
    eventHeadline: headline,
    eventType: outcome,
  };
}
