import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Match, WorldCupTeam } from "../types/Match";
import { fetchFifaMatches, fetchUpcomingFifaMatches } from "../services/matchService";
import { fetchTeams } from "../services/teamService";


/**
 * Hook to fetch all FIFA World Cup 2026 matches
 */
export const useAllFifaMatches = (): UseQueryResult<Match[], Error> => {
  return useQuery({
    queryKey: ["fifa-matches-all"],
    queryFn: fetchFifaMatches,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to fetch only upcoming FIFA World Cup 2026 matches
 */
export const useUpcomingFifaMatches = (): UseQueryResult<Match[], Error> => {
  return useQuery({
    queryKey: ["fifa-matches-upcoming"],
    queryFn: fetchUpcomingFifaMatches,
    staleTime: 1000 * 60 * 10, // 10 minutes (refresh more frequently for upcoming)
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to fetch FIFA World Cup 2026 teams
 */
export const useTeams = (): UseQueryResult<WorldCupTeam[], Error> => {
  return useQuery({
    queryKey: ["fifa-teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 60, // 1 hour (teams rarely change)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

