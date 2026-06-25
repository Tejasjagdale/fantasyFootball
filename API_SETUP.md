# FIFA World Cup 2026 API Integration Guide

This guide explains how to set up the FIFA World Cup 2026 matches API integration for the Goal Guess app.

## Overview

The app fetches live FIFA World Cup 2026 match data using the **RapidAPI Sports API** (api-football service). This provides:
- Upcoming matches
- Live match data
- Team logos
- Kick-off times and venues
- Match results

## Setup Instructions

### 1. Get a RapidAPI Key

1. Visit [RapidAPI Sports API](https://rapidapi.com/api-sports/api/api-football/)
2. Click **"Subscribe to Free"** to get the free tier (500 requests/month)
3. Once subscribed, go to your dashboard and find your **API Key**
4. Copy the API key

### 2. Create Environment File

Create a `.env.local` file in the root of your project:

```bash
# .env.local
VITE_SPORTS_API_KEY=your_api_key_here_from_rapidapi
```

Replace `your_api_key_here_from_rapidapi` with your actual RapidAPI key.

### 3. Restart Development Server

```bash
npm run dev
```

The app will now fetch and display real FIFA World Cup 2026 matches!

## API Endpoints

### Fetch All FIFA Matches
```typescript
import { fetchFifaMatches } from "@/services/matchService";

const allMatches = await fetchFifaMatches();
```

### Fetch Upcoming FIFA Matches Only
```typescript
import { fetchUpcomingFifaMatches } from "@/services/matchService";

const upcomingMatches = await fetchUpcomingFifaMatches();
```

## Using React Query Hook

The easiest way to use matches in your components:

```typescript
import { useUpcomingFifaMatches } from "@/hooks/useMatches";

export default function MyComponent() {
  const { data: matches = [], isLoading, error } = useUpcomingFifaMatches();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          homeLogo={match.homeLogo}
          awayLogo={match.awayLogo}
          kickoff={match.kickoff}
        />
      ))}
    </div>
  );
}
```

## Data Caching & Performance

The React Query hooks include automatic caching:
- **Upcoming matches**: Refreshed every 10 minutes
- **All matches**: Refreshed every 15 minutes
- **Cache duration**: 1 hour

This means:
- First load fetches from API
- Subsequent loads use cached data for faster performance
- Background refetch happens when stale

## Available Match Properties

```typescript
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoff: string;
  kickoffDate: Date;
  venue?: string;
  status: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
  leagueId?: number;
  matchDay?: number;
}
```

## Error Handling

The service includes automatic retry logic:
- 2 automatic retries on failure
- Exponential backoff (1s, 2s, up to 30s)
- Error messages logged to console
- User-friendly error alerts in UI

## Troubleshooting

### No Matches Showing?
- Check that `.env.local` file exists
- Verify API key is correct in RapidAPI dashboard
- Check browser console for error messages
- Ensure free tier limit not exceeded (500/month)

### "Failed to Load Matches" Error?
- Verify network connectivity
- Check API key validity
- Check RapidAPI rate limits
- Try again after a few seconds (rate limiting)

### Getting 403 Error?
- API key may be invalid
- Free tier may be expired
- Check RapidAPI subscription status

## File Structure

```
src/
├── services/
│   └── matchService.ts      # API service functions
├── hooks/
│   └── useMatches.ts         # React Query hooks
├── types/
│   └── Match.ts              # TypeScript interfaces
└── App.tsx                   # Updated to use real data
```

## Free vs Paid Tier

**Free Tier:**
- 500 requests/month
- All endpoints available
- Perfect for development

**Paid Tier:**
- Higher request limits
- For production deployments
- Starting at $2.99/month

See [RapidAPI Sports API pricing](https://rapidapi.com/api-sports/api/api-football/pricing) for details.

## Next Steps

- ✅ Display matches (DONE)
- 🔄 Add match predictions storage
- 🔄 Update leaderboard with predictions
- 🔄 Add real-time match updates
- 🔄 Deploy to production

## Support

For API-related issues, check:
- [API Documentation](https://www.api-football.com/documentation)
- [RapidAPI Support](https://rapidapi.com/support)

For app-related issues, check the console logs and verify your `.env.local` configuration.
