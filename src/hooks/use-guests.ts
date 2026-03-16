import { useInfiniteQuery } from "@tanstack/react-query";
import type { GuestStats } from "@/db/types";

export function useInfiniteGuestStats(limit = 20) {
  return useInfiniteQuery({
    queryKey: ["guest-stats-infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/guests/stats?page=${pageParam}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch guest stats");
      }
      return response.json() as Promise<GuestStats[]>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limit ? undefined : allPages.length + 1;
    },
  });
}
