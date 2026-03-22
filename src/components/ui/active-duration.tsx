"use client";

import { Clock, Timer } from "lucide-react";
import { use, useEffect, useState } from "react";
import type { DbResult } from "@/db/types";
import { cn } from "@/lib/utils";

interface ActiveDurationProps {
  checkedOutAt: string | Date;
  settingsPromise: Promise<DbResult<Record<string, string>>>;
}

export default function ActiveDuration({
  checkedOutAt,
  settingsPromise,
}: ActiveDurationProps) {
  const [now, setNow] = useState(new Date());

  const settings = use(settingsPromise);
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const startTime = new Date(checkedOutAt).getTime();
  const diffMs = now.getTime() - startTime;
  const minOut = Math.floor(diffMs / (1000 * 60));
  const h = Math.floor(minOut / 60);
  const m = minOut % 60;

  const hoursOut = diffMs / (1000 * 60 * 60);
  const yellow = Number(settings.data?.yellowTriggerHours || 2);
  const red = Number(settings.data?.redTriggerHours || 3);

  function getDurationColor() {
    if (hoursOut >= red) return "text-destructive font-bold";
    if (hoursOut >= yellow)
      return "text-yellow-600 font-bold dark:text-yellow-500";
    return "text-green-600 dark:text-green-500";
  }

  const departureTime = new Date(checkedOutAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
        <Timer className="w-3 h-3" /> Started at {departureTime}
      </div>
      <div
        className={cn("text-xs flex items-center gap-1", getDurationColor())}
      >
        <Clock className="w-3 h-3" /> Out for {h}h {m}m
      </div>
    </div>
  );
}
