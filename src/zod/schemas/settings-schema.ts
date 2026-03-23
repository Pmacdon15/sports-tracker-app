import z from "zod";

export const settingsSchema = z.object({
  yellow_trigger_hours: z.string().min(1, "Required"),
  red_trigger_hours: z.string().min(1, "Required"),
});
