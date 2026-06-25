export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  kickoff: string;
  kickoffDate: Date;
  venue?: string;
  status: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
  group?: string;
  matchDay?: number;
  homeScorerss?: string;
  awayScorerss?: string;
  homeTeamId: string;
  awayTeamId: string;
}

// Response format from worldcup26.ir API
export interface WorldCupMatch {
  _id: string;
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_scorers: string;
  away_scorers: string;
  group: string;
  matchday: string;
  local_date: string;
  persian_date: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: string;
  home_team_name_en: string;
  home_team_name_fa: string;
  away_team_name_en: string;
  away_team_name_fa: string;
}

export interface WorldCupApiResponse {
  games: WorldCupMatch[];
}

export interface WorldCupTeam {
  _id: string;
  name_en: string;
  name_fa: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
  id: string;
}

export interface WorldCupTeamsResponse {
  teams: WorldCupTeam[];
}

