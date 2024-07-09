import { z } from 'zod';

const pokemonSchema = z.object({
	name: z.string(),
	url: z.string().url()
});

export const placeholderSchema = z.object({
	count: z.number(),
	next: z.string().url(),
	previous: z.string().url().nullable(),
	results: pokemonSchema.array()
});

export type Placeholder = z.infer<typeof placeholderSchema>;
export type Pokemon = z.infer<typeof pokemonSchema>;
