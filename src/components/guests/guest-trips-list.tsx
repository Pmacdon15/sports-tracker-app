import { differenceInMinutes, format } from "date-fns";
import {
  AlertCircle,
  ArrowUpRight,
  Box,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import type { DbResult, Transaction } from "@/db/types";

interface GuestTripsListProps {
  tripsPromise: Promise<DbResult<Transaction[]>>;
}

export default function GuestTripsList({ tripsPromise }: GuestTripsListProps) {
  const result = use(tripsPromise);

  if (result.error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-muted">
        <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
        <p>{result.error}</p>
      </div>
    );
  }

  const trips = result.data || [];

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-muted">
        <Clock className="h-12 w-12 mb-4 opacity-20" />
        <p>No trips recorded for this guest yet.</p>
      </div>
    );
  }

  const calculateDuration = (start: Date, end: Date | null) => {
    if (!end) return null;
    const minutes = differenceInMinutes(new Date(end), new Date(start));
    const hours = (minutes / 60).toFixed(1);
    return hours;
  };

  return (
    <Card className="shadow-lg border-primary/5 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Trip History
          </CardTitle>
          <Badge variant="outline" className="bg-background">
            {trips.length} Total Trips
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/10">
              <TableHead className="w-30">Status</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Checkout</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Return</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => {
              const duration = calculateDuration(
                trip.checked_out_at,
                trip.checked_in_at,
              );
              const isOut = trip.status === "OUT";

              return (
                <TableRow
                  key={trip.id}
                  className="group transition-colors hover:bg-primary/2"
                >
                  <TableCell>
                    {isOut ? (
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15 flex items-center gap-1 w-fit">
                        <ArrowUpRight className="h-3 w-3" />
                        Out Now
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/15 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" />
                        Returned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Box className="h-3.5 w-3.5 text-muted-foreground" />
                        Unit {trip.equipment_unit}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-tight">
                        {trip.equipment_type || "General Equipment"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {format(new Date(trip.checked_out_at), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(trip.checked_out_at), "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {duration ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-primary">
                          {duration}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          hrs
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        ongoing
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {trip.checked_in_at ? (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium">
                            {format(new Date(trip.checked_in_at), "MMM d, yyyy")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(trip.checked_in_at), "h:mm a")}
                          </span>
                        </div>
                        {trip.return_photo_url && (
                          <div className="mt-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <img 
                                  src={`/api/photo?url=${encodeURIComponent(trip.return_photo_url)}`} 
                                  alt="Return" 
                                  className="w-10 h-10 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity" 
                                />
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl w-full p-1 border-none bg-transparent shadow-none">
                                <DialogTitle className="sr-only">View Photo</DialogTitle>
                                <img 
                                  src={`/api/photo?url=${encodeURIComponent(trip.return_photo_url)}`} 
                                  alt="Return Full Size" 
                                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg" 
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-amber-600 italic">
                        pending
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
