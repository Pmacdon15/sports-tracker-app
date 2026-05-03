"use client";
import { useRouter, useSearchParams } from "next/navigation";

import React, { use } from "react";
import type { DbResult, Transaction } from "@/db/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { TabsContent } from "../ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../ui/dialog";
import { TimezoneRedirect } from "../auth/TimezoneRedirect";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Badge } from "../ui/badge";

export default function ReturnsTab({
  completedRentalsPromise,
  initialDatePromise,
  settingsPromise,
}: {
  completedRentalsPromise: Promise<DbResult<Transaction[]>>;
  initialDatePromise: Promise<string | undefined>;
  settingsPromise: Promise<DbResult<Record<string, string>>>;
}) {
  const completedRes = use(completedRentalsPromise);
  const initialDate = use(initialDatePromise);
  const settingsRes = use(settingsPromise);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(() => {
    if (initialDate) return initialDate;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const allCompletedRentals = completedRes.data || [];
  const settings = settingsRes.data || {};
  const error = completedRes.error || settingsRes.error;

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

  const filteredCompletedRentals = allCompletedRentals.filter((rental) => {
    const search = searchTerm.toLowerCase();
    return (
      rental.guest_name?.toLowerCase().includes(search) ||
      rental.equipment_unit?.toLowerCase().includes(search) ||
      rental.equipment_type?.toLowerCase().includes(search)
    );
  });

  const averageDuration = React.useMemo(() => {
    if (filteredCompletedRentals.length === 0) return null;
    const totalMinutes = filteredCompletedRentals.reduce((acc, rental) => {
      if (!rental.checked_in_at) return acc;
      const start = new Date(rental.checked_out_at).getTime();
      const end = new Date(rental.checked_in_at).getTime();
      return acc + (end - start) / (1000 * 60);
    }, 0);
    const avgMinutes = Math.round(totalMinutes / filteredCompletedRentals.length);
    const h = Math.floor(avgMinutes / 60);
    const m = avgMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [filteredCompletedRentals]);

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
              <div className="flex items-center gap-2">
                <CardTitle>Daily Returns</CardTitle>
                {averageDuration && (
                  <Badge variant="secondary" className="font-normal text-muted-foreground">
                    Avg: {averageDuration}
                  </Badge>
                )}
              </div>
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
              <Input
                placeholder="Filter by guest, unit, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : filteredCompletedRentals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No results matching your search."
                : "No returns for this date."}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredCompletedRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <div>
                      <span className="font-semibold">{rental.guest_name}</span>{" "}
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
                  <div className="text-xs text-muted-foreground text-right flex flex-col items-end gap-2">
                    <div className="flex flex-col items-end">
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
                    {rental.return_photo_url && (
                      <div className="mt-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <img 
                              src={`/api/photo?url=${encodeURIComponent(rental.return_photo_url)}`} 
                              alt="Return" 
                              className="w-12 h-12 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity" 
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-full p-1 border-none bg-transparent shadow-none">
                            <DialogTitle className="sr-only">View Photo</DialogTitle>
                            <img 
                              src={`/api/photo?url=${encodeURIComponent(rental.return_photo_url)}`} 
                              alt="Return Full Size" 
                              className="w-full h-auto max-h-[85vh] object-contain rounded-lg" 
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
