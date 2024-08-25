import { superForm } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { todosSchema } from './schema';

export const load = (async () => {
	return {
		form: superForm({}, zod(todosSchema))
	};
}) satisfies PageServerLoad;
