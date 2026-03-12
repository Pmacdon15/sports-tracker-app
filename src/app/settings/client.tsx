"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { processSettingsUpdate } from "@/app/actions";
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

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const yellow = formData.get("yellow_trigger_hours") as string;
      const red = formData.get("red_trigger_hours") as string;
      const result = await processSettingsUpdate({
        yellow_trigger_hours: yellow,
        red_trigger_hours: red,
      });
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="border-primary/20 shadow-sm">
      <form action={(fd) => mutation.mutate(fd)}>
        <CardHeader>
          <CardTitle>Rental Triggers</CardTitle>
          <CardDescription>
            Set the hours it takes before an active rental shows as yellow or
            red on the "Who's Out" tracker.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="px-8 shadow-sm"
          >
            {mutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
