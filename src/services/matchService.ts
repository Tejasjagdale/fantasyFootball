import axios from "axios";
import type { Match, WorldCupApiResponse, WorldCupTeam } from "../types/Match";

const API_URL = "https://worldcup26.ir/get/games";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/**
 * Fetch all FIFA World Cup 2026 matches from the open API
 */
export const fetchFifaMatches = async (): Promise<Match[]> => {
  try {
    const response = await apiClient.get<WorldCupApiResponse>("");

    if (!response.data.games || response.data.games.length === 0) {
      console.warn("No matches found for FIFA World Cup 2026");
      return [];
    }

    return response.data.games.map((match) => ({
      id: match.id,
      homeTeam: match.home_team_name_en,
      awayTeam: match.away_team_name_en,
      kickoff: formatKickoff(match.local_date),
      kickoffDate: parseDate(match.local_date),
      status: mapStatus(match.finished === "TRUE", match.time_elapsed),
      homeScore: parseInt(match.home_score, 10),
      awayScore: parseInt(match.away_score, 10),
      group: match.group,
      matchDay: parseInt(match.matchday, 10),
      homeScorerss: match.home_scorers !== "null" ? match.home_scorers : undefined,
      awayScorerss: match.away_scorers !== "null" ? match.away_scorers : undefined,
      homeTeamId: match.home_team_id,
      awayTeamId: match.away_team_id,
    }));
  } catch (error) {
    console.error("Error fetching FIFA World Cup matches:", error);
    throw error;
  }
};

/**
 * Fetch upcoming FIFA World Cup matches only
 */
export const fetchUpcomingFifaMatches = async (): Promise<Match[]> => {
  try {
    const response = await apiClient.get<WorldCupApiResponse>("");

    if (!response.data.games || response.data.games.length === 0) {
      console.warn("No upcoming matches found for FIFA World Cup 2026");
      return [];
    }

    // Filter only upcoming matches
    const upcomingMatches = response.data.games.filter(
      (match) => match.finished !== "TRUE"
    );

    return upcomingMatches.map((match) => ({
      id: match.id,
      homeTeam: match.home_team_name_en,
      awayTeam: match.away_team_name_en,
      kickoff: formatKickoff(match.local_date),
      kickoffDate: parseDate(match.local_date),
      status: "upcoming" as const,
      group: match.group,
      matchDay: parseInt(match.matchday, 10),
      homeTeamId: match.home_team_id,
      awayTeamId: match.away_team_id,
    }));
  } catch (error) {
    console.error("Error fetching upcoming FIFA World Cup matches:", error);
    throw error;
  }
};

/**
 * Enrich match data with team flags and logos from teams data
 */
export const enrichMatchesWithTeamData = (
  matches: Match[],
  teams: WorldCupTeam[]
): Match[] => {
  const teamMap = teams.reduce((map, team) => {
    map[team.id] = team;
    return map;
  }, {} as Record<string, WorldCupTeam>);

  return matches.map((match) => ({
    ...match,
    homeLogo: teamMap[match.homeTeamId]?.flag,
    awayLogo: teamMap[match.awayTeamId]?.flag,
  }));
};

/**
 * Parse date from format "06/13/2026 21:00"
 */
const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

/**
 * Format kickoff time in a human-readable format
 */
const formatKickoff = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffDays === 0) {
    return `Today • ${time}`;
  } else if (diffDays === 1) {
    return `Tomorrow • ${time}`;
  } else if (diffDays <= 7) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return `${dayName} • ${time}`;
  } else {
    const dateFormatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${dateFormatted} • ${time}`;
  }
};

/**
 * Map API status to app status
 */
const mapStatus = (
  finished: boolean,
  timeElapsed: string
): "upcoming" | "live" | "finished" => {
  if (finished === true) return "finished";
  if (timeElapsed === "finished") return "finished";
  if (timeElapsed !== "null" && timeElapsed !== "finished") return "live";
  return "upcoming";
};

