import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllEquipment } from "@/data/equipment";
import { InventoryCreateForm, InventoryDeleteButton } from "./client";

export default async function InventoryPage() {
  const equipment = await getAllEquipment();

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
        {/* ADD EQUIPMENT */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 border-primary/20 shadow-sm">
            <CardHeader>
              <CardTitle>Add Equipment</CardTitle>
              <CardDescription>Standard unit into the DB.</CardDescription>
            </CardHeader>
            <InventoryCreateForm />
          </Card>
        </div>

        {/* LIST EQUIPMENT */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory ({equipment.length})</CardTitle>
            </CardHeader>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
