import { z } from 'zod';

export const jsonPlaceholderSchema = z.object({
	id: z.number(),
	title: z.string(),
	userId: z.number(),
	body: z.string()
});

const jsonPlaceholderPartialSchema = z.object({
	id: z.number(),
	title: z.string(),
	userId: z.number(),
	body: z.string(),
});

export const jsonPlaceholderWithChildrenSchema = jsonPlaceholderPartialSchema.merge(
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
export type JsonPlaceholder = z.infer<typeof jsonPlaceholderSchema>;

const range = (len: number) => {
	const arr: number[] = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

export function makeData(data: JsonPlaceholder[], ...lens: number[]) {
	const makeDataLevel = (depth = 0): JsonPlaceholderWithChildren[] => {
		const len = lens[depth]!;
		return range(len).map((_, idx): JsonPlaceholderWithChildren => {
			return {
				...data[idx],
				children: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
			};
		});
	};

	return makeDataLevel();
}
