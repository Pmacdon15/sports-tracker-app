import { TabsContent } from "@radix-ui/react-tabs";
import { Clock, Plus } from "lucide-react"; // Added Plus icon
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
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Who's Out</CardTitle>
          <CardDescription>
            Currently rented equipment. Color indicates duration triggers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Loading State */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm animate-pulse">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                {/* Simulated Name/Title */}
                <div className="h-5 w-32 bg-muted rounded-md" />
                {/* The "Plus" Loading Indicator */}
                <div className="flex items-center gap-1 text-primary/40">
                  <Plus className="w-4 h-4 animate-spin-slow" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
                </div>
              </div>

              {/* Simulated Unit Info */}
              <div className="h-4 w-24 bg-muted/60 rounded-md" />
              
              {/* Simulated Clock/Time */}
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground/50" />
                <div className="h-3 w-16 bg-muted/40 rounded-md" />
              </div>
            </div>
          </div>
          
          {/* Subtle secondary hint that more is coming */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground/50 italic">Syncing live data...</p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}