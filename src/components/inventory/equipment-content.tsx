import { InventoryDeleteButton } from "@/app/inventory/client";
import type { Equipment } from "@/data/equipment";
import { CardContent } from "../ui/card";

export default async function EquipmentContent({
  equipmentPromise,
}: {
  equipmentPromise: Promise<Equipment[]>;
}) {
  const equipment = await equipmentPromise;
  return (
    <CardContent>
      <div className="grid sm:grid-cols-2 gap-3">
        {equipment.map((eq) => (
          <div
            key={eq.id}
            className="flex justify-between items-center p-3 border rounded border-border/50 bg-secondary/10"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-foreground">
                {eq.unit_number}
              </span>
              <span className="text-xs text-muted-foreground">
                {eq.type} &bull;{" "}
                <span
                  className={
                    eq.status === "AVAILABLE"
                      ? "text-green-600"
                      : "text-blue-600"
                  }
                >
                  {eq.status}
                </span>
              </span>
            </div>
            <InventoryDeleteButton unit_number={eq.unit_number} />
          </div>
        ))}
        {equipment.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            Warehouse is empty. Start adding equipment.
          </div>
        )}
      </div>
    </CardContent>
  );
}
