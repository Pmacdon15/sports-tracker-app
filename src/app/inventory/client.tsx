"use client";

import { useAuth } from "@clerk/nextjs";
import { use, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DbResult, UnitType } from "@/db/types";
import {
  useAddEquipmentMutation,
  useDeleteEquipmentMutation,
} from "@/mutations/equipment";

export function InventoryCreateForm({
  equipmentTypePromise,
}: {
  equipmentTypePromise: Promise<DbResult<UnitType[]>>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });
  const { mutate: addEquipment, isPending } = useAddEquipmentMutation();
  
  const [selectedType, setSelectedType] = useState<string>("Raft");


  const data = use(equipmentTypePromise);

  const unitTypes = data.data ?? [];

  const unitTypeOptions = unitTypes.map((t) => ({
    label: t.name,
    value: t.name,
  }));

  if (!isAdmin) return null;
  const handleAdd = async (formData: FormData) => {
    const type = selectedType;
    const unit_number = formData.get("unit_number") as string;

    addEquipment(
      { type, unit_number },
      {
        onSuccess: () => {
          toast.success(`Added equipment ${unit_number}`);
          formRef.current?.reset();
        },
        onError: (error: Error) => toast.error(error.message),
      },
    );
  };

  return (
    // <div className="grid md:grid-cols-3 gap-8">
    <div className="md:col-span-1">
      <Card className="sticky top-24 border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Add Equipment</CardTitle>
          <CardDescription>Standard unit into the DB.</CardDescription>
        </CardHeader>
        <form ref={formRef} action={handleAdd}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unit Number (ID)</Label>
              <Input
                name="unit_number"
                placeholder="e.g. R-402"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Combobox
                options={unitTypeOptions}
                value={selectedType}
                onValueChange={setSelectedType}
                placeholder="Select or Type Type"
                allowCustom={true}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full shadow-sm"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add to Inventory"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    // </div>
  );
}

export function InventoryDeleteButton({
  unit_number,
}: {
  unit_number: string;
}) {
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });

  const { mutate: deleteEq, isPending } = useDeleteEquipmentMutation();

  if (!isAdmin) return null;
  return (
    <Button
      type="button"
      variant="destructive"
      // size="icon"
      className="text-destructive hover:bg-destructive/10"
      onClick={() => {
        deleteEq(unit_number, {
          onSuccess: () => toast.success(`Deleted equipment ${unit_number}`),
          onError: (error: Error) => toast.error(error.message),
        });
      }}
      disabled={isPending}
    >
      Delete
    </Button>
  );
}
