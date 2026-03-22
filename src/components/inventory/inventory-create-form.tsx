"use client";

import { useAuth } from "@clerk/nextjs";
import { useForm } from "@tanstack/react-form";
import { use } from "react";
import z from "zod";
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
import { Button } from "../ui/button";
export function InventoryCreateForm({
  equipmentTypePromise,
}: {
  equipmentTypePromise: Promise<DbResult<UnitType[]>>;
}) {
  // const formRef = useRef<HTMLFormElement>(null);
  const { has } = useAuth();
  const isAdmin = has({ role: "org:admin" });
  const { mutate: addEquipment, isPending } = useAddEquipmentMutation();

  // const [selectedType, setSelectedType] = useState<string>("Raft");

  const data = use(equipmentTypePromise);

  const unitTypes = data.data ?? [];

  const unitTypeOptions = unitTypes.map((t) => ({
    label: t.name,
    value: t.name,
  }));

  const createInventorySchema = z.object({
    unit_number: z.string().min(1, "Name too short").max(50, "Name too long"),
    type: z.string().min(1, "Pick or create a type").max(50, "Type too long"),
  });

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      unit_number: "",
      type: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
    validators: {
      onSubmit: createInventorySchema,
      onBlur: createInventorySchema,
      // onChange: createInventorySchema,
    },
  });

  if (!isAdmin) return null;

  // const handleAdd = async (formData: FormData) => {
  //   const type = selectedType;
  //   const unit_number = formData.get("unit_number") as string;

  //   addEquipment(
  //     { type, unit_number },
  //     {
  //       onSuccess: () => {
  //         toast.success(`Added equipment ${unit_number}`);
  //         // formRef.current?.reset();
  //       },
  //       onError: (error: Error) => toast.error(error.message),
  //     },
  //   );
  // };

  return (
    // <div className="grid md:grid-cols-3 gap-8">
    <div className="md:col-span-1">
      <Card className="sticky top-24 border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Add Equipment</CardTitle>
          <CardDescription>Standard unit into the DB.</CardDescription>
        </CardHeader>
        <form
          // ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unit Number (ID)</Label>
              <Field name="unit_number">
                {(field) => {
                  const { errors, isTouched } = field.state.meta;
                  return (
                    <>
                      <Input
                        name="unit_number"
                        placeholder="e.g. R-402"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isPending}
                      />
                      {ErrorEvent.length > 0 && isTouched && (
                        <span className="text-red-500">
                          {errors[0]?.message}
                        </span>
                      )}
                    </>
                  );
                }}
              </Field>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Field name="type">
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
                      {ErrorEvent.length > 0 && isTouched && (
                        <span className="text-red-500">
                          {errors[0]?.message}
                        </span>
                      )}
                    </>
                  );
                }}
              </Field>
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
