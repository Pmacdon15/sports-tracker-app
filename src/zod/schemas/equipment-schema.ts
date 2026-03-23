import z from "zod";

export const createInventorySchema = z.object({
  unit_number: z.string().min(1, "Name too short").max(50, "Name too long"),
  type: z.string().min(1, "Pick or create a type").max(50, "Type too long"),
});

export const deleteEquipmentSchema = z.object({
  unit_number: z.string().min(1, "Name too short").max(50, "Name too long"),
});
