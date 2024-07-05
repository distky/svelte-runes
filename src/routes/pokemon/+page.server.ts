import type { PageServerLoad } from './$types';
import { placeholderSchema, type Placeholder } from './schema';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('https://pokeapi.co/api/v2/pokemon');

	const data: Placeholder = placeholderSchema.parse(await response.json());

	return {
		fetchData: data
	};
};
