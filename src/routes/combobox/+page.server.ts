import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { formSchema } from './+page.svelte';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(formSchema));

	// Always return { form } in load functions
	return { form };
};
