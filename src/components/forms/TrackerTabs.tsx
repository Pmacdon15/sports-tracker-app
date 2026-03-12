"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowRightIcon, Clock, CornerDownLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import {
  processCheckout,
  processEquipmentCreate,
  processReturn,
} from "@/app/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function TrackerTabs({
  activeRentals,
  completedRentals,
  equipment,
  guests,
  settings,
  initialDate,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [guestName, setGuestName] = React.useState("");
  const [checkoutUnit, setCheckoutUnit] = React.useState("");
  const [checkoutType, setCheckoutType] = React.useState("Raft");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(
    initialDate || new Date().toISOString().split("T")[0],
  );

  const guestOptions = guests.map((g: any) => ({
    label: g.name,
    value: g.name,
  }));

  const availableEqOptions = equipment
    .filter((e: any) => e.status === "AVAILABLE")
    .map((e: any) => ({
      label: `${e.unit_number} (${e.type})`,
      value: e.unit_number,
    }));

  const isNewUnit =
    checkoutUnit !== "" &&
    !availableEqOptions.some((opt:any) => opt.value === checkoutUnit);

  const checkoutMutation = useMutation({
    mutationFn: async (data: {
      unit_number: string;
      guest_name: string;
      type?: string;
    }) => {
      const exists = availableEqOptions.some(
        (opt:any) => opt.value === data.unit_number,
      );
      if (!exists) {
        const createResult = await processEquipmentCreate({
          type: data.type || "Raft",
          unit_number: data.unit_number,
        });
        if (!createResult.success) throw new Error(createResult.message);
      }
      const result = await processCheckout({
        unit_number: data.unit_number,
        guest_name: data.guest_name,
      });
      if (!result?.success)
        throw new Error(result?.message || "Error checking out item");
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setGuestName("");
      setCheckoutUnit("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const returnMutation = useMutation({
    mutationFn: async (unit_number: string) => {
      const result = await processReturn({ unit_number });
      if (!result?.success)
        throw new Error(result?.message || "Error returning item");
      return result;
    },
    onSuccess: (data) => toast.success(data.message),
    onError: (error: Error) => toast.error(error.message),
  });

  async function handleCheckout(formData: FormData) {
    if (!guestName || !checkoutUnit) {
      toast.error("Please select both a guest and a unit.");
      return;
    }
    checkoutMutation.mutate({
      guest_name: guestName,
      unit_number: checkoutUnit,
      type: isNewUnit ? checkoutType : undefined,
    });
  }

  async function handleReturn(unit_number: string) {
    returnMutation.mutate(unit_number);
  }

  function getDurationColor(checkedOutAt: Date) {
    const yellow = parseFloat(settings.yellow_trigger_hours || "2");
    const red = parseFloat(settings.red_trigger_hours || "3");
    const hoursOut =
      (Date.now() - new Date(checkedOutAt).getTime()) / (1000 * 60 * 60);

    if (hoursOut >= red) return "text-destructive font-bold";
    if (hoursOut >= yellow)
      return "text-yellow-600 font-bold dark:text-yellow-500";
    return "text-green-600 dark:text-green-500";
  }

  const allCompletedRentals = completedRentals || [];

  const filteredCompletedRentals = allCompletedRentals.filter((rental: any) => {
    const search = searchTerm.toLowerCase();
    return (
      rental.guest_name?.toLowerCase().includes(search) ||
      rental.equipment_unit?.toLowerCase().includes(search) ||
      rental.equipment_type?.toLowerCase().includes(search)
    );
  });

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", newDate);
    router.replace(`/tracker?${params.toString()}`);
  };

  function formatDuration(checkedOutAt: Date) {
    const minOut = Math.floor(
      (Date.now() - new Date(checkedOutAt).getTime()) / (1000 * 60),
    );
    const h = Math.floor(minOut / 60);
    const m = minOut % 60;
    return `${h}h ${m}m`;
  }

  return (
    <Tabs defaultValue="checkout" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="checkout">Checkout</TabsTrigger>
        <TabsTrigger value="active">Who's Out</TabsTrigger>
        <TabsTrigger value="returns">Recent Returns</TabsTrigger>
      </TabsList>

      {/* CHECKOUT TAB */}
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
                  <Select
                    value={checkoutType}
                    onValueChange={setCheckoutType}
                    required
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Raft">Raft</SelectItem>
                      <SelectItem value="Bike">Bike</SelectItem>
                      <SelectItem value="Kayak">Kayak</SelectItem>
                      <SelectItem value="Helmet">Helmet</SelectItem>
                      <SelectItem value="Paddle">Paddle</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    This unit will be added to your permanent inventory.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={checkoutMutation.isPending}
                className="w-full font-semibold text-lg py-6 shadow-md shadow-primary/20 gap-2"
              >
                <ArrowRightIcon className="w-5 h-5" />
                Send Out
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      {/* ACTIVE TAB */}
      <TabsContent value="active">
        <Card>
          <CardHeader>
            <CardTitle>Who's Out</CardTitle>
            <CardDescription>
              Currently rented equipment. Color indicates duration triggers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeRentals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nobody's out! All equipment is in base.
              </div>
            ) : (
              <div className="grid gap-4">
                {activeRentals.map((rental: any) => (
                  <div
                    key={rental.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg">
                        {rental.guest_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Unit:{" "}
                        <span className="text-foreground font-medium">
                          {rental.equipment_unit}
                        </span>{" "}
                        ({rental.equipment_type})
                      </span>
                      <span
                        className={cn(
                          "text-xs flex items-center gap-1 mt-1",
                          getDurationColor(rental.checked_out_at),
                        )}
                      >
                        <Clock className="w-3 h-3" /> Out for{" "}
                        {formatDuration(rental.checked_out_at)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturn(rental.equipment_unit)}
                      disabled={returnMutation.isPending}
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <CornerDownLeftIcon className="w-4 h-4 mr-2" />
                      Return
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="returns">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Daily Returns</CardTitle>
                <CardDescription>
                  View and search returns for {selectedDate}.
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full sm:w-auto"
                />
                <Input
                  placeholder="Filter by guest, unit, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCompletedRentals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No results matching your search."
                  : "No returns for this date."}
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredCompletedRentals.map((rental: any) => (
                  <div
                    key={rental.id}
                    className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold">{rental.guest_name}</span>{" "}
                      returned{" "}
                      <span className="font-medium">
                        {rental.equipment_unit}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground text-right flex flex-col items-end">
                      <span>
                        {new Date(rental.checked_in_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>
                        {new Date(rental.checked_in_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
