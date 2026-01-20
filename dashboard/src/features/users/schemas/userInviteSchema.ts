import { z } from "zod";

export const userInviteSchema = z.object({
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  company_id: z.number().min(1, "Empresa é obrigatória"),
  role: z.enum(["company", "control"]),
  expires_at: z.string().optional(), // Will be computed as 48h from now if not provided
});

export type UserInviteFormData = z.infer<typeof userInviteSchema>;
