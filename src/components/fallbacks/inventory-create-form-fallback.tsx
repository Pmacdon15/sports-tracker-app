import { ChevronsUpDown } from "lucide-react";
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

export default function InventoryCreateFormFallback() {
  return (
    <div className="md:col-span-1">
      <Card className="sticky top-24 border-primary/20 shadow-sm opacity-60">
        <CardHeader>
          <CardTitle>Add Equipment</CardTitle>
          <CardDescription>Standard unit into the DB.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Unit Number (ID)</Label>
            <Input placeholder="Loading..." disabled />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="w-full">
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between opacity-50 cursor-not-allowed pointer-events-none"
              >
                <span className="truncate">{"Loading"}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full shadow-sm" disabled>
            Loading...
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
