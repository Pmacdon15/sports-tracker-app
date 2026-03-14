"use client";

import { use } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DbResult } from "@/db/types";
import { useUpdateSettingMutation } from "@/mutations/settings";

export function SettingsForm({
  initialSettingsPromise,
}: {
  initialSettingsPromise: Promise<DbResult<Record<string, string>>>;
}) {
  const settingsRes = use(initialSettingsPromise);
  const initialSettings = settingsRes.data || {};
  const error = settingsRes.error;

  const { mutate: updateSettings, isPending } = useUpdateSettingMutation();

  const handleSave = async (formData: FormData) => {
    const yellow = formData.get("yellow_trigger_hours") as string;
    const red = formData.get("red_trigger_hours") as string;

    updateSettings(
      {
        yellow_trigger_hours: yellow,
        red_trigger_hours: red,
      },
      {
        onSuccess: () => toast.success("Settings updated"),
        onError: (error: Error) => toast.error(error.message),
      },
    );
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <form action={handleSave}>
        <CardHeader>
          <CardTitle>Rental Triggers</CardTitle>
          <CardDescription>
            Set the hours it takes before an active rental shows as yellow or
            red on the "Who's Out" tracker.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-yellow-600 dark:text-yellow-500 font-bold">
              Yellow Trigger (Hours)
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.5"
                name="yellow_trigger_hours"
                defaultValue={initialSettings.yellow_trigger_hours || "2"}
                className="max-w-[200px]"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Rentals out longer than this amount of time will appear yellow.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-destructive font-bold">
              Red Trigger (Hours)
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.5"
                name="red_trigger_hours"
                defaultValue={initialSettings.red_trigger_hours || "3"}
                className="max-w-[200px]"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Rentals out longer than this amount of time will appear red,
              indicating a strict overdue status.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="px-8 shadow-sm">
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
