"use client";

import { Clock, Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useRef, useState, ViewTransition } from "react";
import type { DbResult } from "@/db/types";
import { cn } from "@/lib/utils";
import { TimezoneRedirect } from "../auth/TimezoneRedirect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { TabsContent } from "../ui/tabs";
import { useInfiniteCompletedRentals } from "@/hooks/use-completed-rentals";

export default function ReturnsTab({
  initialDatePromise,
  settingsPromise,
}: {
  initialDatePromise: Promise<string | undefined>;
  settingsPromise: Promise<DbResult<Record<string, string>>>;
}) {
  const initialDate = use(initialDatePromise);
  const settingsRes = use(settingsPromise);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDate) return initialDate;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error: queryError,
  } = useInfiniteCompletedRentals(selectedDate, 20, debouncedSearch);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allCompletedRentals = data?.pages.flat() || [];
  const settings = settingsRes.data || {};
  const error = queryError instanceof Error ? queryError.message : settingsRes.error;

  function formatDuration(checkedOutAt: Date, checkedInAt: Date | null) {
    if (!checkedInAt) return "N/A";
    const minOut = Math.floor(
      (new Date(checkedInAt).getTime() - new Date(checkedOutAt).getTime()) /
        (1000 * 60),
    );
    const h = Math.floor(minOut / 60);
    const m = minOut % 60;
    return `${h}h ${m}m`;
  }

  function getDurationColor(checkedOutAt: Date, checkedInAt: Date | null) {
    if (!checkedInAt) return "text-muted-foreground";
    const yellow = parseFloat(settings.yellow_trigger_hours || "2");
    const red = parseFloat(settings.red_trigger_hours || "3");
    const hoursOut =
      (new Date(checkedInAt).getTime() - new Date(checkedOutAt).getTime()) /
      (1000 * 60 * 60);

    if (hoursOut >= red) return "text-destructive font-bold";
    if (hoursOut >= yellow)
      return "text-yellow-600 font-bold dark:text-yellow-500";
    return "text-green-600 dark:text-green-500";
  }

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", newDate);
    router.replace(`/tracker?${params.toString()}`);
  };

  if (!initialDate) return <TimezoneRedirect />;

  return (
    <TabsContent value="returns">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Daily Returns</CardTitle>
              <CardDescription>
                View and search returns for {selectedDate}.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full sm:w-auto"
              />
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by guest, unit, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : status === "pending" && allCompletedRentals.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Loading returns...</p>
            </div>
          ) : allCompletedRentals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No results matching your search."
                : "No returns for this date."}
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {allCompletedRentals.map((rental) => (
                  <ViewTransition key={rental.id}>
                    <div className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col gap-0.5">
                        <div>
                          <span className="font-semibold">
                            {rental.guest_name}
                          </span>{" "}
                          returned{" "}
                          <span className="font-medium">
                            {rental.equipment_unit}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "text-xs flex items-center gap-1",
                            getDurationColor(
                              rental.checked_out_at,
                              rental.checked_in_at,
                            ),
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          {formatDuration(
                            rental.checked_out_at,
                            rental.checked_in_at,
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right flex flex-col items-end">
                        <span>
                          {rental.checked_in_at
                            ? new Date(rental.checked_in_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "N/A"}
                        </span>
                        <span>
                          {rental.checked_in_at
                            ? new Date(rental.checked_in_at).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  </ViewTransition>
                ))}
              </div>

              {/* Sentinel for auto-loading */}
              <div
                ref={sentinelRef}
                className="h-24 flex items-center justify-center p-4"
              >
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-2 text-primary font-medium">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-[10px] animate-pulse uppercase tracking-wider">
                      Loading More
                    </span>
                  </div>
                ) : hasNextPage ? (
                  <span className="text-xs text-muted-foreground animate-pulse">
                    Scroll for more results
                  </span>
                ) : (
                  <div className="flex flex-col items-center gap-1 opacity-60">
                    <div className="h-px w-24 bg-muted-foreground/30 mb-2" />
                    <span className="text-[10px] text-muted-foreground italic font-medium uppercase tracking-widest">
                      End of Results ({allCompletedRentals.length})
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
