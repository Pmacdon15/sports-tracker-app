"use client";
import { Suspense, use, useOptimistic, ViewTransition } from "react";
import type { DbResult, Transaction } from "@/db/types";
import ReturnButton from "../buttons/return-button";
import ActiveDuration from "../ui/active-duration";
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

  // Inside your ActiveTab component
  const [optimisticState, setOptimistic] = useOptimistic(
    rentalsRes,
    (state, unitNumberToRemove: string) => {
      if (!state.data) return state;

      return {
        ...state,
        data: state.data.filter(
          (rental) => rental.equipment_unit !== unitNumberToRemove,
        ),
      };
    },
  );
  const activeRentals = optimisticState.data || [];

  const error = rentalsRes.error;

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
                <ViewTransition key={rental.id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
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
                      <Suspense>
                        <ActiveDuration
                          checkedOutAt={rental.checked_out_at}
                          settingsPromise={settingsPromise}
                        />
                      </Suspense>
                    </div>
                    <ReturnButton
                      equipment_unit={rental.equipment_unit}
                      onReturn={() => setOptimistic(rental.equipment_unit)}
                    />
                  </div>
                </ViewTransition>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
