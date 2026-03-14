import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function SettingsFallback() {
  return (
    <Card className="border-primary/20 shadow-sm">
      <form>
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
                defaultValue={""}
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
                defaultValue={""}
                className="max-w-50"
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
          <Button type="submit" disabled={true} className="px-8 shadow-sm">
            Save Settings
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
