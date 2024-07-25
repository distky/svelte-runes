import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect, type Actions } from '@sveltejs/kit';

const postSchema = z.object({
	id: z.number(),
	title: z.string(),
	body: z.string().min(1),
	userId: z.number()
});

type Post = z.infer<typeof postSchema>;

export const load = (async ({ fetch, params, request }) => {
	if (!params.id) redirect(302, request.url + '/add');

	if (params.id === 'add') {
		return {
			post: await superValidate(zod(postSchema))
		};
	}

	const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`).then(
		(response) => response.json()
	);

	const post: Post = postSchema.parse(response);

	console.log(post);
	return {
		post: await superValidate(post, zod(postSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(postSchema));
		console.log(form);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data

		// Display a success status message
		return message(form, 'Form posted successfully!');
	}
};
