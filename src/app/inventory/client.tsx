"use client";

import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { processEquipmentCreate, processEquipmentDelete } from "@/app/actions";
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

export function InventoryCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const type = formData.get("type") as string;
      const unit_number = formData.get("unit_number") as string;
      const result = await processEquipmentCreate({ type, unit_number });
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      formRef.current?.reset();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <form
      ref={formRef}
      action={(fd) => {
        mutation.mutate(fd);
      }}
    >
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Unit Number (ID)</Label>
          <Input
            name="unit_number"
            placeholder="e.g. R-402"
            required
            disabled={mutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            name="type"
            required
            defaultValue="Raft"
            disabled={mutation.isPending}
          >
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
        <Button
          type="submit"
          className="w-full shadow-sm"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Adding..." : "Add to Inventory"}
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
  const mutation = useMutation({
    mutationFn: async () => {
      const result = await processEquipmentDelete(unit_number);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
