"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { use, useMemo } from "react";
import { toast } from "sonner";
import type { DbResult, Equipment, Guest, UnitType } from "@/db/types";
import { useCheckoutMutation } from "@/mutations/transactions";
import { checkoutSchema } from "@/zod/schemas/transaction-schema";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FormFieldCombobox } from "../ui/form-field";
import { TabsContent } from "../ui/tabs";

export default function CheckoutTab({
  equipmentPromise,
  equipmentTypePromise,
  guestsPromise,
}: {
  equipmentPromise: Promise<DbResult<Equipment[]>>;
  equipmentTypePromise: Promise<DbResult<UnitType[]>>;
  guestsPromise: Promise<DbResult<Guest[]>>;
}) {
  const guestsRes = use(guestsPromise);
  const equipmentRes = use(equipmentPromise);
  const equipmentType = use(equipmentTypePromise);

  const guests = guestsRes.data || [];
  const equipment = equipmentRes.data || [];
  const unitTypes = equipmentType.data || [];
  // const error = guestsRes.error || equipmentRes.error;

  const availableEqOptions = useMemo(
    () =>
      equipment
        .filter((e) => e.status === "AVAILABLE")
        .map((e) => ({
          label: `${e.unit_number} (${e.type})`,
          value: e.unit_number,
        })),
    [equipment],
  );

  const { mutate: checkout, isPending } = useCheckoutMutation();

  const form = useForm({
    defaultValues: {
      guest_name: "",
      unit_number: "",
      type: "",
    },
    onSubmit: async ({ value }) => {
      const isNewUnit =
        value.unit_number !== "" &&
        !availableEqOptions.some((opt) => opt.value === value.unit_number);

      // Final logic safety check
      if (isNewUnit && !value.type) {
        toast.error("Please select a type for the new unit.");
        return;
      }

      checkout(
        {
          guest_name: value.guest_name,
          unit_number: value.unit_number,
          type: isNewUnit ? value.type : "",
        },
        {
          onSuccess: () => {
            toast.success(`Successfully checked out unit ${value.unit_number}`);
            form.reset();
          },
          onError: (err: Error) => toast.error(err.message),
        },
      );
    },
    validators: {
      onSubmit: checkoutSchema,
      onChange: checkoutSchema,
    },
  });

  const guestOptions = guests.map((g) => ({ label: g.name, value: g.name }));
  const unitTypeOptions = unitTypes.map((t) => ({
    label: t.name,
    value: t.name,
  }));

  return (
    <TabsContent value="checkout">
      <Card className="shadow-sm border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Checkout Equipment
          </CardTitle>
          <CardDescription>
            Select a guest and an available unit to send out.
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-6">
            {/* Use your original FormFieldCombobox pattern */}
            <FormFieldCombobox
              formApi={form}
              name="guest_name"
              label="Guest Name"
              placeholder="Select or Type Guest Name..."
              options={guestOptions}
              allowCustom={true}
              disabled={isPending}
            />

            <FormFieldCombobox
              formApi={form}
              name="unit_number"
              label="Unit Number / Type"
              placeholder="Select Available Unit..."
              options={availableEqOptions}
              allowCustom={true}
              disabled={isPending}
            />

            <form.Subscribe selector={(state) => state.values.unit_number}>
              {(unit_number) => {
                const isNewUnit =
                  unit_number !== "" &&
                  !availableEqOptions.some((opt) => opt.value === unit_number);

                if (!isNewUnit) return null;

                return (
                  <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
                    <FormFieldCombobox
                      formApi={form}
                      name="type"
                      label="New Unit Detected - Select Type"
                      placeholder="Select or Type Unit Type..."
                      options={unitTypeOptions}
                      allowCustom={true}
                      disabled={isPending}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This unit will be added to your permanent inventory.
                    </p>
                  </div>
                );
              }}
            </form.Subscribe>
          </CardContent>

          <CardFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isPending || isSubmitting}
                  className="w-full font-semibold text-lg py-6 shadow-md gap-2"
                >
                  {isPending || isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRightIcon className="w-5 h-5" />
                  )}
                  {isPending || isSubmitting ? "Processing..." : "Send Out"}
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
}
