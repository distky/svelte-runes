import type { PageLoad } from './$types';
import { placeholderSchema, type Placeholder } from './+page.svelte';

export const load: PageLoad = async ({ fetch }) => {
	const data: Placeholder = placeholderSchema.parse(
		await fetch('https://pokeapi.co/api/v2/pokemon').then((response) => response.json())
	);

	return {
		fetchData: data
	};
};

export const ssr = false;
