import { TimezoneRedirect } from "@/components/auth/TimezoneRedirect";
import { TrackerTabs } from "@/components/forms/TrackerTabs";
import { getAllEquipment } from "@/data/equipment";
import { getAllGuests } from "@/data/guests";
import { getSettings } from "@/data/settings";
import { getActiveRentals, getCompletedRentals } from "@/data/transactions";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TrackerPage({ searchParams }: PageProps) {
  const { timezone, date } = await searchParams;
  const tzStr = Array.isArray(timezone) ? timezone[0] : timezone;
  const dateStr = Array.isArray(date) ? date[0] : date;

  if (!tzStr) {
    return <TimezoneRedirect />;
  }

  const [activeRentals, completedRentals, equipment, guests, settings] =
    await Promise.all([
      getActiveRentals(),
      getCompletedRentals(55, 0, tzStr, dateStr),
      getAllEquipment(),
      getAllGuests(),
      getSettings(),
    ]);

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
        activeRentals={activeRentals}
        completedRentals={completedRentals}
        equipment={equipment}
        guests={guests}
        settings={settings}
        timezone={tzStr}
        initialDate={dateStr}
      />
    </div>
  );
}
