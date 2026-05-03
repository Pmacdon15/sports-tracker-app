"use client";
import { useAuth } from "@clerk/nextjs";
import imageCompression from "browser-image-compression";
import { CornerDownLeftIcon } from "lucide-react";
import { startTransition, useState } from "react";
import { useReturnMutation } from "@/mutations/transactions";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ReturnButton({
  equipment_unit,
  onReturn,
}: {
  equipment_unit: string;
  onReturn: (action: string) => void;
}) {
  const { mutate: returnItem, isPending } = useReturnMutation();
  const { has } = useAuth();
  const hasImageStorage = has({ feature: "store_images" });

  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  async function handleReturn() {
    let finalPhoto = photo;
    if (photo) {
      setIsCompressing(true);
      try {
        finalPhoto = await imageCompression(photo, {
          maxSizeMB: 0.6,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
      } catch (error) {
        console.error("Image compression failed:", error);
      } finally {
        setIsCompressing(false);
      }
    }

    startTransition(() => {
      onReturn(equipment_unit);
      returnItem({
        unit_number: equipment_unit,
        photo: finalPhoto,
      });
      setOpen(false);
    });
  }

  if (!hasImageStorage) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-primary/50 text-primary hover:bg-primary/10"
        onClick={() => {
          startTransition(() => {
            onReturn(equipment_unit);
            returnItem({ unit_number: equipment_unit, photo: null });
          });
        }}
        disabled={isPending}
      >
        <CornerDownLeftIcon className="w-4 h-4 mr-2" />
        {isPending ? "Returning..." : "Return"}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/50 text-primary hover:bg-primary/10"
        >
          <CornerDownLeftIcon className="w-4 h-4 mr-2" />
          Return
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Equipment</DialogTitle>
          <DialogDescription>
            Are you sure you want to return {equipment_unit}? Optionally, add a
            return photo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="photo">Return Photo (Optional)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleReturn} disabled={isPending || isCompressing}>
            {isCompressing
              ? "Compressing..."
              : isPending
                ? "Returning..."
                : "Confirm Return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
