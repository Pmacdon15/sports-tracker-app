"use client";

import { useForm } from "@tanstack/react-form";
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
import { FormFieldInput } from "@/components/ui/form-field";
import type { DbResult } from "@/db/types";
import { useUpdateSettingMutation } from "@/mutations/settings";
import { settingsSchema } from "@/zod/schemas/settings-schema";

export function SettingsForm({
  initialSettingsPromise,
}: {
  initialSettingsPromise: Promise<DbResult<Record<string, string>>>;
}) {
  const settingsRes = use(initialSettingsPromise);
  const initialSettings = settingsRes.data || {};
  const error = settingsRes.error;

  const { mutate: updateSettings, isPending } = useUpdateSettingMutation();

  const form = useForm({
    defaultValues: {
      yellow_trigger_hours: initialSettings.yellow_trigger_hours || "2",
      red_trigger_hours: initialSettings.red_trigger_hours || "3",
    },
    onSubmit: async ({ value }) => {
      updateSettings(value, {
        onSuccess: () => toast.success("Settings updated"),
        onError: (err: Error) => toast.error(err.message),
      });
    },
    validators: {
      onSubmit: settingsSchema,
      onChange: settingsSchema,
    },
  });

  return (
    <Card className="border-primary/20 shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardHeader>
          <CardTitle>Rental Triggers</CardTitle>
          <CardDescription>
            Set the hours it takes before an active rental shows as yellow or
            red on the "Who's Out" tracker.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {error && (
            <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}

          {/* Yellow Trigger Field */}
          <div className="relative">
            <FormFieldInput
              formApi={form}
              name="yellow_trigger_hours"
              label="Yellow Trigger (Hours)"
              validator={settingsSchema.shape.yellow_trigger_hours}
              type="number"
              step="0.5"
              className="max-w-[200px] font-bold text-yellow-600 border-yellow-400 focus-visible:ring-yellow-400"
              helperText="Rentals out longer than this amount of time will appear yellow."
            />
          </div>

          {/* Red Trigger Field */}
          <div className="relative">
            <FormFieldInput
              formApi={form}
              name="red_trigger_hours"
              label="Red Trigger (Hours)"
              validator={settingsSchema.shape.red_trigger_hours}
              type="number"
              step="0.5"
              className="max-w-[200px] font-bold text-red-600 border-red-400 focus-visible:ring-red-400"
              helperText="Rentals out longer than this amount of time will appear red, indicating a strict overdue status."
            />
          </div>

          {/* Real-time Preview */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-dashed flex items-center justify-around">
            <p className="text-sm font-medium text-muted-foreground">
              Preview:
            </p>
            <form.Subscribe
              selector={(state) => [
                state.values.yellow_trigger_hours,
                state.values.red_trigger_hours,
              ]}
            >
              {([yellow, red]) => (
                <div className="flex gap-4">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold border border-yellow-300 text-xs">
                    {yellow}h Warning
                  </span>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold border border-red-300 text-xs">
                    {red}h Overdue
                  </span>
                </div>
              )}
            </form.Subscribe>
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
