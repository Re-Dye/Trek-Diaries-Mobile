import { z } from 'zod';
import { CONSTANTS } from '../constants';
export const addPostFormSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  // trail_condition: z.number().min(0, "Enter a valid number").max(5, "Enter a valid number"),
  trail_condition: z.number(),
  weather: z.number(),
  accessibility: z.number(),
  image: z.string(),
});

export type AddPostFormData = z.infer<typeof addPostFormSchema>;

export const addPostRequestSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  trail_condition: z.number().min(0, 'Enter a valid number').max(5, 'Enter a valid number'),
  weather: z.number().min(0, 'Enter a valid number').max(5, 'Enter a valid number'),
  accessibility: z.number().min(0, 'Enter a valid number').max(5, 'Enter a valid number'),
  image_url: z.string().url().min(1, 'Image is required'),
  location_id: z.string().uuid().min(1, 'Location is required'),
  owner_id: z.string().uuid().min(1, 'Owner is required'),
});

export type AddPostRequestData = z.infer<typeof addPostRequestSchema>;
