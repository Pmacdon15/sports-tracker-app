import { Clock } from "lucide-react";
import { use } from "react";
import type { DbResult, Transaction } from "@/db/types";
import { cn } from "@/lib/utils";
import ReturnButton from "../buttons/return-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TabsContent } from "../ui/tabs";

export default function ActiveTab({
  rentalsPromise,
  settingsPromise,
}: {
  rentalsPromise: Promise<DbResult<Transaction[]>>;
  settingsPromise: Promise<DbResult<Record<string, string>>>;
}) {
  const rentalsRes = use(rentalsPromise);
  const settingsRes = use(settingsPromise);

  const activeRentals = rentalsRes.data || [];
  const settings = settingsRes.data || {};
  const error = rentalsRes.error || settingsRes.error;

  function formatDuration(checkedOutAt: Date) {
    const minOut = Math.floor(
      (Date.now() - new Date(checkedOutAt).getTime()) / (1000 * 60),
    );
    const h = Math.floor(minOut / 60);
    const m = minOut % 60;
    return `${h}h ${m}m`;
  }

  function getDurationColor(checkedOutAt: Date) {
    const yellow = parseFloat(settings.yellow_trigger_hours || "2");
    const red = parseFloat(settings.red_trigger_hours || "3");
    const hoursOut =
      (Date.now() - new Date(checkedOutAt).getTime()) / (1000 * 60 * 60);

    if (hoursOut >= red) return "text-destructive font-bold";
    if (hoursOut >= yellow)
      return "text-yellow-600 font-bold dark:text-yellow-500";
    return "text-green-600 dark:text-green-500";
  }

  return (
    <TabsContent value="active">
      <Card>
        <CardHeader>
          <CardTitle>Who's Out</CardTitle>
          <CardDescription>
            Currently rented equipment. Color indicates duration triggers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : activeRentals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nobody's out! All equipment is in base.
            </div>
          ) : (
            <div className="grid gap-4">
              {activeRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">
                      {rental.guest_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Unit:{" "}
                      <span className="text-foreground font-medium">
                        {rental.equipment_unit}
                      </span>{" "}
                      ({rental.equipment_type})
                    </span>
                    <span
                      className={cn(
                        "text-xs flex items-center gap-1 mt-1",
                        getDurationColor(rental.checked_out_at),
                      )}
                    >
                      <Clock className="w-3 h-3" /> Out for{" "}
                      {formatDuration(rental.checked_out_at)}
                    </span>
                  </div>
                  <ReturnButton equipment_unit={rental.equipment_unit} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
