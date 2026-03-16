import { format } from "date-fns";
import { Calendar, Package, User } from "lucide-react";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { DbResult, Guest } from "@/db/types";

interface GuestTripsHeaderProps {
  guestPromise: Promise<DbResult<Guest>>;
}

export default function GuestTripsHeader({
  guestPromise,
}: GuestTripsHeaderProps) {
  const result = use(guestPromise);

  if (result.error || !result.data) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="py-6 italic text-destructive text-center">
          {result.error || "Guest not found"}
        </CardContent>
      </Card>
    );
  }

  const guest = result.data;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {guest.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                Joined {format(new Date(guest.created_at), "MMMM yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Package className="h-4 w-4" />
              <span>ID: {guest.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Card className="bg-primary/5 border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardContent className="px-6 py-4 flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-1">
              Status
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-bold">Active Guest</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
