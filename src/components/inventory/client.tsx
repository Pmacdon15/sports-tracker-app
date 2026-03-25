"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { use, useMemo, useOptimistic, useState, ViewTransition } from "react";
import { AlertDialogDestructive } from "@/components/dialogs/delete-inventory";
import { AlertDialogRetire } from "@/components/dialogs/retire-inventory";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DbResult, Equipment } from "@/db/types";
import { InventoryDeleteButton } from "../buttons/delete-equipment-button";
import { InventoryRetireButton } from "../buttons/retire-equipment-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type OptimisticAction = {
  unit_number: string;
  type: "DELETE" | "RETIRE";
};

export function EquipmentList({
  equipmentPromise,
}: {
  equipmentPromise: Promise<DbResult<Equipment[]>>;
}) {
  const equipmentRes = use(equipmentPromise);
  const initialData = equipmentRes.data || [];
  const error = equipmentRes.error;

  const [optimisticEquipment, setOptimistic] = useOptimistic(
    initialData,
    (state: Equipment[], action: OptimisticAction) => {
      if (action.type === "DELETE") {
        return state.filter((eq) => eq.unit_number !== action.unit_number);
      }
      if (action.type === "RETIRE") {
        return state.map((eq) =>
          eq.unit_number === action.unit_number
            ? { ...eq, status: "RETIRED" }
            : eq
        );
      }
      return state;
    }
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEquipment = useMemo(() => {
    return optimisticEquipment.filter((eq) => {
      const matchesSearch = eq.unit_number
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || eq.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || eq.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [optimisticEquipment, search, typeFilter, statusFilter]);

  const unitTypes = useMemo(() => {
    const types = new Set(optimisticEquipment.map((eq) => eq.type));
    return Array.from(types).sort();
  }, [optimisticEquipment]);

  const statuses = ["AVAILABLE", "CHECKED_OUT", "RETIRED"];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50";
      case "CHECKED_OUT":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
      case "RETIRED":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
      case "DELETED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50";
      default:
        return "bg-muted text-muted-foreground border-transparent";
    }
  };

  if (error) {
    return (
      <CardContent className="py-12 text-center text-destructive">
        {error}
      </CardContent>
    );
  }

  if (initialData.length === 0) {
    return (
      <CardContent className="py-12 text-center text-muted-foreground">
        Please add Equipment
      </CardContent>
    );
  }

  return (
    <CardContent className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search unit number (e.g. R-402)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 text-base shadow-sm border-primary/10 focus-visible:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-35">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 border-primary/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {unitTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-35">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 border-primary/10">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 max-h-150 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {filteredEquipment.map((eq) => (
          <ViewTransition key={eq.id}>
            <div className="flex justify-between items-center p-4 border rounded-xl border-border/50 bg-secondary/5 hover:bg-secondary/10 transition-all duration-200 hover:shadow-md group relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10 group-hover:bg-primary/30 transition-colors" />
              <div className="flex flex-col gap-1.5 ml-1">
                <span className="font-bold text-lg text-foreground tracking-tight leading-none">
                  {eq.unit_number}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                    {eq.type}
                  </span>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${getStatusStyles(eq.status)}`}
                  >
                    {eq.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {eq.status !== "RETIRED" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogRetire>
                        <InventoryRetireButton 
                          unit_number={eq.unit_number} 
                          onRetire={() => setOptimistic({ unit_number: eq.unit_number, type: "RETIRE" })}
                        />
                      </AlertDialogRetire>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Retire this equipment</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogDestructive>
                      <InventoryDeleteButton 
                        unit_number={eq.unit_number} 
                        onDelete={() => setOptimistic({ unit_number: eq.unit_number, type: "DELETE" })}
                      />
                    </AlertDialogDestructive>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete this equipment</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </ViewTransition>
        ))}
        {filteredEquipment.length === 0 && (
          <div className="col-span-full py-24 text-center flex flex-col items-center justify-center border border-dashed rounded-2xl bg-muted/5 border-primary/10">
            <div className="p-5 rounded-full bg-primary/5 mb-5 ring-8 ring-primary/2">
              <Search className="h-10 w-10 text-primary/40" />
            </div>
            <p className="text-xl font-semibold text-foreground/90">
              No matching units
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="mt-6 rounded-full px-6"
            >
              Reset all filters
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-border/40 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {filteredEquipment.length}
          </span>
          <span className="text-sm text-muted-foreground">
            of {initialData.length} units listed
          </span>
        </div>
      </div>
    </CardContent>
  );
}