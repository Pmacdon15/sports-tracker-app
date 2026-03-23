"use client";

import { useAuth } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import { use } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormFieldCombobox, FormFieldInput } from "@/components/ui/form-field";
import type { DbResult, UnitType } from "@/db/types";
import { useAddEquipmentMutation } from "@/mutations/equipment";
import { createInventorySchema } from "@/zod/schemas/equipment-schema";
import { Button } from "../ui/button";

export function InventoryCreateForm({
  equipmentTypePromise,
}: {
  equipmentTypePromise: Promise<DbResult<UnitType[]>>;
}) {
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });
  const { mutate: addEquipment, isPending } = useAddEquipmentMutation();

  const data = use(equipmentTypePromise);
  const unitTypes = data.data ?? [];

  const unitTypeOptions = unitTypes.map((t) => ({
    label: t.name,
    value: t.name,
  }));

  const form = useForm({
    defaultValues: {
      unit_number: "",
      type: "",
    },
    onSubmit: async ({ value }) => {
      // Destructure from the validated value object
      const { unit_number, type } = value;

      addEquipment(
        { type, unit_number },
        {
          onSuccess: () => {
            toast.success(`Added equipment ${unit_number}`);
            form.reset();
          },
          onError: (error: Error) => toast.error(error.message),
        },
      );
    },
    validators: {
      onSubmit: createInventorySchema,
      onChange: createInventorySchema,
    },
  });

  if (!isAdmin) return null;

  return (
    <div className="md:col-span-1">
      <Card className="sticky top-24 border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Add Equipment</CardTitle>
          <CardDescription>Standard unit into the DB.</CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            <FormFieldInput
              formApi={form}
              name="unit_number"
              label="Unit Number (ID)"
              validator={createInventorySchema.shape.unit_number}
              placeholder="e.g. R-402"
              disabled={isPending}
            />

            <FormFieldCombobox
              formApi={form}
              name="type"
              label="Type"
              validator={createInventorySchema.shape.type}
              options={unitTypeOptions}
              placeholder="Select or Type Type"
              allowCustom={true}
              disabled={isPending}
            />
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
  );
}
