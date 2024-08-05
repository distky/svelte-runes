import { z } from 'zod';

const jsonPlaceholderSchema = z.object({
	id: z.number(),
	title: z.string(),
	userId: z.number()
});

export const jsonPlaceholderWithChildrenSchema = jsonPlaceholderSchema.merge(
	z.object({
		children: z
			.object({
				id: z.number(),
				title: z.string(),
				body: z.string(),
				userId: z.number()
			})
			.array()
			.optional()
	})
);

export const paginatedSchema = z.object({
	count: z.number(),
	results: jsonPlaceholderWithChildrenSchema.array()
});

export type JsonPlaceholderWithChildren = z.infer<typeof jsonPlaceholderWithChildrenSchema>;
export type JsonPlaceholderPaginated = z.infer<typeof paginatedSchema>;
