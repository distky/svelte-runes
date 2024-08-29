import { z } from 'zod';

export const todosSchema = z.object({
	name: z.string(),
	todos: z
		.object({
			task: z.string(),
			status: z.string()
		})
		.array()
});

export type Todos = z.infer<typeof todosSchema>;
