import { z } from 'zod';

export const nameSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name is too long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name cannot contain numbers or special characters' }),
});
