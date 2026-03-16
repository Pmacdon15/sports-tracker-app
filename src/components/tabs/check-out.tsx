"use client";
import { ArrowRightIcon } from "lucide-react";
import React, { use } from "react";
import { toast } from "sonner";
import type { DbResult, Equipment, Guest, UnitType } from "@/db/types";
import { useCheckoutMutation } from "@/mutations/transactions";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Combobox } from "../ui/combobox";
import { Label } from "../ui/label";
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
  const error = guestsRes.error || equipmentRes.error;

  const [guestName, setGuestName] = React.useState("");
  const [checkoutUnit, setCheckoutUnit] = React.useState("");
  const [checkoutType, setCheckoutType] = React.useState("");

  const availableEqOptions = equipment
    .filter((e) => e.status === "AVAILABLE")
    .map((e) => ({
      label: `${e.unit_number} (${e.type})`,
      value: e.unit_number,
    }));

  const { mutate: checkout, isPending } = useCheckoutMutation();

  async function handleCheckout() {
    if (!guestName || !checkoutUnit) {
      toast.error("Please select both a guest and a unit.");
      return;
    }
    checkout(
      {
        guest_name: guestName,
        unit_number: checkoutUnit,
        type: isNewUnit ? checkoutType : undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Successfully checked out unit ${checkoutUnit}`);
          setGuestName("");
          setCheckoutUnit("");
        },
        onError: (error: Error) => toast.error(error.message),
      },
    );
  }

  const guestOptions = guests.map((g) => ({
    label: g.name,
    value: g.name,
  }));

  const isNewUnit =
    checkoutUnit !== "" &&
    !availableEqOptions.some((opt) => opt.value === checkoutUnit);

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
        {error ? (
          <CardContent className="py-12 text-center text-destructive">
            {error}
          </CardContent>
        ) : (
          <form action={handleCheckout}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Guest Name</Label>
                <Combobox
                  options={guestOptions}
                  value={guestName}
                  onValueChange={setGuestName}
                  placeholder="Select or Type Guest Name..."
                  allowCustom={true}
                />
              </div>

              <div className="space-y-2">
                <Label>Unit Number / Type</Label>
                <Combobox
                  options={availableEqOptions}
                  value={checkoutUnit}
                  onValueChange={setCheckoutUnit}
                  placeholder="Select Available Unit..."
                  allowCustom={true}
                />
              </div>

              {isNewUnit && (
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="text-primary font-bold">
                    New Unit Detected - Select Type
                  </Label>
                  <Combobox
                    options={unitTypeOptions || []}
                    value={checkoutType}
                    onValueChange={setCheckoutType}
                    placeholder="Select or Type Unit Type..."
                    allowCustom={true}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This unit will be added to your permanent inventory.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full font-semibold text-lg py-6 shadow-md shadow-primary/20 gap-2"
              >
                <ArrowRightIcon className="w-5 h-5" />
                Send Out
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </TabsContent>
  );
}
