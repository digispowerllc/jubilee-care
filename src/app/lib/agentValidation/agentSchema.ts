import { z } from "zod";

export const AgentSchema = z.object({
    surname: z.string().min(2, "Surname is required"),
    firstName: z.string().min(2, "First name is required"),
    otherName: z.string().optional(),
    email: z.string().email("Invalid email"),
    phone: z.string().min(11, "Phone must be 11 digits"),
    nin: z.string().length(11, "NIN must be 11 characters"),
    state: z.string().min(3, "State is required"),
    lga: z.string().min(10, "LGA must be at least 10 characters"),
    address: z.string().min(10, "Address too short"),
});

export type AgentData = z.infer<typeof AgentSchema>;