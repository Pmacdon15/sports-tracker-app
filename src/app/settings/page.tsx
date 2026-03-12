import { getSettings } from "@/data/settings";
import { SettingsForm } from "./client";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="container mx-auto py-8 px-4 flex-1 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure application wide triggers and intervals.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
