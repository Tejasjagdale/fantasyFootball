import axios from "axios";
import type { WorldCupTeam, WorldCupTeamsResponse } from "../types/Match";

const API_URL = "https://worldcup26.ir/get/teams";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/**
 * Fetch all FIFA World Cup 2026 teams
 */
export const fetchTeams = async (): Promise<WorldCupTeam[]> => {
  try {
    const response = await apiClient.get<WorldCupTeamsResponse>("");

    if (!response.data.teams || response.data.teams.length === 0) {
      console.warn("No teams found for FIFA World Cup 2026");
      return [];
    }

    return response.data.teams;
  } catch (error) {
    console.error("Error fetching FIFA World Cup teams:", error);
    throw error;
  }
};

/**
 * Create a map of team ID to team data for quick lookups
 */
export const createTeamMap = (teams: WorldCupTeam[]): Record<string, WorldCupTeam> => {
  return teams.reduce((map, team) => {
    map[team.id] = team;
    return map;
  }, {} as Record<string, WorldCupTeam>);
};
