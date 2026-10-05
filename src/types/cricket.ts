export type MatchFormat = 'Test' | 'ODI' | 'T20' | 'The Hundred';
export type MatchStatus = 'LIVE' | 'COMPLETED' | 'UPCOMING' | 'INNINGS_BREAK' | 'STUMPS' | 'TEA' | 'LUNCH';

export interface BatterScore {
  id: string;
  name: string;
  role?: string;
  dismissal: string; // e.g. "c Carey b Cummins" or "not out"
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  isOnStrike?: boolean;
}

export interface BowlerFigure {
  id: string;
  name: string;
  overs: number; // e.g. 14.2
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  dots: number;
  wides: number;
  noBalls: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  batterName: string;
  over: string;
}

export interface Partnership {
  batter1Name: string;
  batter1Runs: number;
  batter1Balls: number;
  batter2Name: string;
  batter2Runs: number;
  batter2Balls: number;
  totalRuns: number;
  totalBalls: number;
  isCurrent?: boolean;
}

export interface InningsScorecard {
  teamId: string;
  teamName: string;
  inningsNumber: number; // 1, 2, 3, 4
  runs: number;
  wickets: number;
  overs: number;
  declared?: boolean;
  isCurrent?: boolean;
  batting: BatterScore[];
  bowling: BowlerFigure[];
  extras: {
    total: number;
    byes: number;
    legByes: number;
    wides: number;
    noBalls: number;
    penalty: number;
  };
  fallOfWickets: FallOfWicket[];
  didNotBat: string[];
}

export interface CommentaryBall {
  id: string;
  over: string; // "74.3"
  ballNumber: number; // 1 to 6 (or extras)
  bowlerName: string;
  batterName: string;
  runs: number;
  outcomeType: 'dot' | 'single' | 'two' | 'three' | 'four' | 'six' | 'wicket' | 'wide' | 'noball' | 'bye' | 'legbye';
  shortText: string; // "4", "W", "•", "1wd", "6"
  headline: string;
  detail: string;
  speedKmh?: number;
  timestamp: string;
}

export interface ShotZone {
  sector: 'Fine Leg' | 'Square Leg' | 'Mid Wicket' | 'Long On' | 'Long Off' | 'Cover' | 'Point' | 'Third Man';
  runs: number;
  shotsCount: number;
  percentage: number;
  fours: number;
  sixes: number;
}

export interface PitchLengthDelivery {
  zone: 'Yorker' | 'Full' | 'Good Length' | 'Short of Length' | 'Bouncer';
  deliveries: number;
  runsConceded: number;
  wickets: number;
  economy: number;
}

export interface WormDataPoint {
  over: number;
  teamAScore: number;
  teamARunRate: number;
  teamAWickets?: number;
  teamBScore?: number;
  teamBRunRate?: number;
  teamBWickets?: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  role: 'Batter' | 'Wicketkeeper Batter' | 'All-rounder' | 'Bowling All-rounder' | 'Fast Bowler' | 'Spin Bowler';
  isCaptain?: boolean;
  isKeeper?: boolean;
  avatarColor: string;
  country: string;
  iccRanking?: number;
  recentForm?: string[]; // e.g. ["45", "102*", "14", "88"]
}

export interface StandingsTeam {
  rank: number;
  teamName: string;
  shortCode: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  netRunRate: string;
  points: number;
  pointsPercentage?: string;
  form: ('W' | 'L' | 'T' | 'D')[];
}

export interface Match {
  id: string;
  series: string;
  tournamentType: 'ICC' | 'Bilateral' | 'Franchise League' | 'Women International';
  matchTitle: string; // e.g. "4th Test" or "Super 8 - Match 42"
  format: MatchFormat;
  status: MatchStatus;
  statusText: string; // e.g. "Day 4: Session 3 - India need 39 runs to win"
  venue: string;
  city: string;
  country: string;
  weather: {
    condition: string;
    tempC: number;
    humidity: number;
    dewRisk: 'Low' | 'Moderate' | 'High';
  };
  pitchReport: string;
  toss: string;
  umpires: string[];
  tvUmpire: string;
  matchReferee: string;
  teamA: {
    id: string;
    name: string;
    shortCode: string;
    primaryColor: string;
    secondaryColor: string;
    score: string; // "338 & 248/6"
    currentRuns: number;
    currentWickets: number;
    currentOvers: number;
    isBatting: boolean;
  };
  teamB: {
    id: string;
    name: string;
    shortCode: string;
    primaryColor: string;
    secondaryColor: string;
    score: string; // "412 & 212"
    currentRuns: number;
    currentWickets: number;
    currentOvers: number;
    isBatting: boolean;
  };
  currentSituation?: {
    target?: number;
    runsRequired?: number;
    ballsRemaining?: number;
    requiredRunRate?: number;
    currentRunRate: number;
    daySession?: string;
    leadOrTrail?: string;
    winProbability: {
      teamA: number;
      teamB: number;
      draw?: number;
    };
  };
  currentBatters: [BatterScore, BatterScore];
  currentBowler: BowlerFigure;
  currentOverDeliveries: {
    ball: number;
    code: string; // "1", "0", "4", "W", "1wd", "6"
    runs: number;
    isWicket?: boolean;
    isBoundary?: boolean;
  }[];
  recentOversSummary: string[]; // ["Ov 73: 8 runs", "Ov 74: 1 run, 1 wkt"]
  innings: InningsScorecard[];
  partnerships: Partnership[];
  commentary: CommentaryBall[];
  wagonWheel: ShotZone[];
  pitchLengths: PitchLengthDelivery[];
  wormData: WormDataPoint[];
  squads: {
    teamA: PlayerProfile[];
    teamB: PlayerProfile[];
    benchA: PlayerProfile[];
    benchB: PlayerProfile[];
  };
  headToHead: {
    totalMatches: number;
    teamAWins: number;
    teamBWins: number;
    drawsOrTies: number;
  };
}
