import { Suspense } from "react";
import { TrackerTabs } from "@/components/forms/TrackerTabs";
import ActiveTab from "@/components/tabs/active";
import { getAllEquipment } from "@/dal/equipment";
import { getAllGuests } from "@/dal/guests";
import { getSettings } from "@/dal/settings";
import { getActiveRentals, getCompletedRentals } from "@/dal/transactions";
import { getAllUnitTypes } from "@/dal/unit_types";

export default function TrackerPage(props: PageProps<"/tracker">) {
  const rentalsPromise = getActiveRentals();
  const completedRentalsPromise = props.searchParams.then((params) => {
    const dateStr = Array.isArray(params.date) ? params.date[0] : params.date;
    const timezone = Array.isArray(params.timezone)
      ? params.timezone[0]
      : params.timezone;

    return getCompletedRentals(dateStr, timezone);
  });

  const dateStringPromise = props.searchParams.then((params) => {
    return Array.isArray(params.date) ? params.date[0] : params.date;
  });

  const guestsPromise = getAllGuests();
  const equipmentTypePromise = getAllUnitTypes();
  const equipmentPromise = getAllEquipment();
  const settingsPromise = getSettings();

  return (
    <div className="container mx-auto py-8 px-4 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Tracker
          </h1>
          <p className="text-muted-foreground">
            Manage equipment checkouts and returns.
          </p>
        </div>
      </div>

      <TrackerTabs
        activeTab={
          <Suspense>
            <ActiveTab
              rentalsPromise={rentalsPromise}
              settingsPromise={settingsPromise}
            />
          </Suspense>
        }
        equipmentPromise={equipmentPromise}
        completedRentalsPromise={completedRentalsPromise}
        equipmentTypePromise={equipmentTypePromise}
        guestsPromise={guestsPromise}
        initialDatePromise={dateStringPromise}
      />
    </div>
  );
}
