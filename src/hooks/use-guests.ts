import { useInfiniteQuery } from "@tanstack/react-query";
import type { GuestStats } from "@/db/types";

export function useInfiniteGuestStats(limit = 20, search?: string) {
  return useInfiniteQuery({
    queryKey: ["guest-stats-infinite", search],
    queryFn: async ({ pageParam = 1 }) => {
      const url = new URL("/api/guests/stats", window.location.origin);
      url.searchParams.set("page", String(pageParam));
      url.searchParams.set("limit", String(limit));
      if (search) url.searchParams.set("query", search);

      const response = await fetch(url.toString());
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
