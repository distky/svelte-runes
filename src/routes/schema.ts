import { z } from "zod";

export const placeholderSchema = z.object({
	count: z.number(),
	next: z.string().url(),
	previous: z.string().url().nullable(),
	results: z
		.object({
			name: z.string(),
			url: z.string().url()
		})
		.array()
});

export type Placeholder = z.infer<typeof placeholderSchema>;
