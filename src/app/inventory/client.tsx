"use client";

import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddEquipmentMutation,
  useDeleteEquipmentMutation,
} from "@/mutations/equipment";

export function InventoryCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate: addEquipment, isPending } = useAddEquipmentMutation();

  const handleAdd = async (formData: FormData) => {
    const type = formData.get("type") as string;
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
          <Select name="type" required defaultValue="Raft" disabled={isPending}>
            <SelectTrigger>
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
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full shadow-sm" disabled={isPending}>
          {isPending ? "Adding..." : "Add to Inventory"}
        </Button>
      </CardFooter>
    </form>
  );
}

export function InventoryDeleteButton({
  unit_number,
}: {
  unit_number: string;
}) {
  const { mutate: deleteEq, isPending } = useDeleteEquipmentMutation();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10"
      onClick={() => {
        deleteEq(unit_number, {
          onSuccess: () => toast.success(`Deleted equipment ${unit_number}`),
          onError: (error: Error) => toast.error(error.message),
        });
      }}
      disabled={isPending}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
