import "server-only";
import { MOCK_GAMES } from "@/lib/data/mock-games";
import type { Game } from "@/lib/types/game";

export async function getPopularGames(): Promise<Game[]> {
  // "use cache"
  // cacheLife("days")
  // cacheTag("games")
  return MOCK_GAMES;
}
