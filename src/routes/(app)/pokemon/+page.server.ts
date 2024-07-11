import type { PaginationState } from '@tanstack/svelte-table';
import type { PageServerLoad } from './$types';
import { placeholderSchema, type Placeholder } from './schema';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const limit: number = Number(url.searchParams.get('limit') ?? 10);
	const offset: number = Number(url.searchParams.get('offset') ?? 0);
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

	const data: Placeholder = placeholderSchema.parse(await response.json());
	const pagination: PaginationState = {
		pageIndex: offset,
		pageSize: limit
	};

	return {
		fetchData: data,
		pagination
	};
};
