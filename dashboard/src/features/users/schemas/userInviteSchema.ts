import { z } from "zod";

export const userInviteSchema = z.object({
  email: z.string().email("Email inválido"),
  company: z.string().min(1, "Empresa é obrigatória"),
});

export type UserInviteFormData = z.infer<typeof userInviteSchema>;
