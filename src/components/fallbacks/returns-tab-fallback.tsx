import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Search } from "lucide-react"; // Added Search and Plus
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ReturnsTabFallback() {
  return (
    <TabsContent value="returns">
      <Card className="overflow-hidden border-dashed">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="flex items-center gap-2">
                  Daily Returns
                  <Plus className="w-4 h-4 text-primary animate-spin-slow" />
                </CardTitle>

                <Badge
                  variant="secondary"
                  className="font-normal text-muted-foreground/50 bg-muted/50"
                >
                  Avg: --
                </Badge>
              </div>
              <div className="h-4 w-48 bg-muted rounded mt-1" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Skeleton Inputs */}
              <div className="h-10 w-full sm:w-32 bg-muted/40 rounded-md border border-dashed" />
              <div className="relative w-full sm:w-64">
                <div className="h-10 w-full bg-muted/40 rounded-md border border-dashed" />
                <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground/30" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {/* Generating multiple skeleton rows to mimic a list */}
            {[...Array(3)].map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: This is a fallback made up array
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg bg-card/50 shadow-sm animate-pulse"
                style={{ opacity: 1 - i * 0.2 }} // Fades out lower items for a nice effect
              >
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted/60 rounded" />
                </div>
                <div className="h-8 w-20 bg-muted/40 rounded-full" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center justify-center py-4 border-t border-dashed">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 animate-pulse">
              Syncing Ledger
            </span>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
