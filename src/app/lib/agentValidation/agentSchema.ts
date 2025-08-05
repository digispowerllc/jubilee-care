// lib/agentSchema.ts
import { z } from "zod";

export const agentSchema = z.object({
    surname: z.string().min(3).max(30),
    firstName: z.string().min(3).max(30),
    otherName: z.string().min(1).max(30).optional(),
    email: z.string().email(),
    phone: z.string().min(11).max(11),
    nin: z.string().min(11).max(11),
    state: z.string().min(3).max(30),
    lga: z.string().min(2).max(30),
    address: z.string().min(5).max(100),
});
export type Agent = z.infer<typeof agentSchema>;