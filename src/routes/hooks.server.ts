import { type Handle, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/(app)')) {
		return redirect(302, '/login');
	}

	const response = await resolve(event);
	return response;
};
