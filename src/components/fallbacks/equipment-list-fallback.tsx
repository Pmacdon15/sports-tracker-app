import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EquipmentListFallback() {
  return (
    <CardContent className="space-y-6 opacity-60">
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Loading equipment..."
            disabled
            className="pl-9 h-11"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-35">
            <Select disabled>
              <SelectTrigger className="h-10 border-primary/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
            </Select>
          </div>
          <div className="flex-1 min-w-35">
            <Select disabled>
              <SelectTrigger className="h-10 border-primary/10">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 max-h-150 overflow-hidden pr-2 pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 border rounded-xl border-border/50 bg-secondary/5"
          >
            <div className="flex flex-col gap-1.5 ml-1">
              <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-1">
               <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-border/40 px-2">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    </CardContent>
  );
}
