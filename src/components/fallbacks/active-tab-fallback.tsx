import { TabsContent } from "@radix-ui/react-tabs";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function ActiveTabFallback() {
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
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-lg"></span>
              <span className="text-sm text-muted-foreground">
                Unit: <span className="text-foreground font-medium"></span>{" "}
              </span>
              <span className={cn("text-xs flex items-center gap-1 mt-1")}>
                <Clock className="w-3 h-3" /> Out for{" "}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
