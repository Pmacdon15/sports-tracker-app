import { z } from "zod";

export const checkoutSchema = z.object({
  guest_name: z.string().min(1, "Guest name is required").max(50, "Too long"),
  unit_number: z.string().min(1, "Unit number is required").max(50, "Too long"),
  type: z.string().max(50, "Too long"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const returnSchema = z.object({
  unit_number: z.string().min(1, "Unit number is required").max(50),
});

export type ReturnInput = z.infer<typeof returnSchema>;
