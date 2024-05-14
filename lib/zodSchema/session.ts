import { z } from "zod";

export const sessionSchema = z.object({
  token: z.string(),
  id: z.string(),
  name: z.string(),
  email: z.string(),
  dob: z.string(),
  picture: z.string().optional(),
  iat: z.number()
});

export const sessionPayloadSchema = sessionSchema.omit({ token: true });

export type Session = z.infer<typeof sessionSchema>;
export type SessionPayload = z.infer<typeof sessionPayloadSchema>;
