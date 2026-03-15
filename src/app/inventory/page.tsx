import { Suspense } from "react";
import InventoryTotalHeaderFallback from "@/components/fallbacks/inventroy-total-header-fallback";
import EquipmentContent from "@/components/inventory/equipment-content";
import InventoryTotalHeader from "@/components/inventory/inventory-total-header";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllEquipment } from "@/dal/equipment";
import { getAllUnitTypes } from "@/dal/unit_types";
import { InventoryCreateForm } from "./client";

export default function InventoryPage() {
  const equipmentPromise = getAllEquipment();
  const equipmentLengthPromise = equipmentPromise.then(
    (res) => res.data?.length ?? 0,
  );
  const equipmentTypePromise = getAllUnitTypes();

  return (
    <div className="container mx-auto py-8 px-4 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Add new units or permanently delete old units.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Suspense>
          <InventoryCreateForm equipmentTypePromise={equipmentTypePromise} />
        </Suspense>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Suspense fallback={<InventoryTotalHeaderFallback />}>
                <InventoryTotalHeader
                  equipmentLengthPromise={equipmentLengthPromise}
                />
              </Suspense>
            </CardHeader>
            <Suspense>
              <EquipmentContent equipmentPromise={equipmentPromise} />
            </Suspense>
          </Card>
        </div>
      </div>
    </div>
  );
}
