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
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      // onBlur: createInventorySchema,
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
            <div className="space-y-2">
              <Label>Unit Number (ID)</Label>
              <form.Field
                name="unit_number"
                validators={{
                  onChange: createInventorySchema.shape.unit_number,
                }}
              >
                {(field) => {
                  const { errors, isTouched } = field.state.meta;
                  return (
                    <>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        placeholder="e.g. R-402"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isPending}
                      />
                      {errors.length > 0 && isTouched && (
                        <span className="text-xs text-red-500">
                          {errors[0]?.message}
                        </span>
                      )}
                    </>
                  );
                }}
              </form.Field>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <form.Field
                name="type"
                validators={{
                  onChange: createInventorySchema.shape.type,
                }}
              >
                {(field) => {
                  const { errors, isTouched } = field.state.meta;
                  return (
                    <>
                      <Combobox
                        onBlur={field.handleBlur}
                        options={unitTypeOptions}
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val)}
                        placeholder="Select or Type Type"
                        allowCustom={true}
                        disabled={isPending}
                      />
                      {errors.length > 0 && isTouched && (
                        <span className="text-xs text-red-500">
                          {errors[0]?.message}
                        </span>
                      )}
                    </>
                  );
                }}
              </form.Field>
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
  );
}
