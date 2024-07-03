import type { PageLoad } from './$types';
import { placeholderSchema, type Placeholder } from './+page.svelte';

export const load: PageLoad = async ({ fetch, setHeaders }) => {
	const response = await fetch('https://pokeapi.co/api/v2/pokemon');

	const data: Placeholder = placeholderSchema.parse(await response.json());

	setHeaders({
		age: response.headers.get('age') || '',
		'cache-control': response.headers.get('cache-control') || ''
	});

	return {
		fetchData: data
	};
};

export const ssr = false;
