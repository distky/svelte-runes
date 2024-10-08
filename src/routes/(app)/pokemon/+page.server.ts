import type { PaginationState } from '@tanstack/table-core';
import type { PageServerLoad } from './$types';
import { placeholderSchema, type Placeholder } from './schema';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const limit: number = Number(url.searchParams.get('limit') ?? 10);
	const offset: number = Number(url.searchParams.get('offset') ?? 0);
	const filter: string | undefined = url.searchParams.get('filter') ?? undefined;
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

	const data: Placeholder = placeholderSchema.parse(await response.json());

	if (filter) {
		data.results = data.results.filter((result) =>
			result.name.toUpperCase().includes(filter.toUpperCase())
		);
		data.count = data.results.length;
	}

	const pagination: PaginationState & { hasNext: boolean; hasPrevious: boolean } = {
		pageIndex: offset,
		pageSize: limit,
		hasNext: data.next != null,
		hasPrevious: data.previous != null
	};

	return {
		fetchData: {
			paginationData: data,
			paginationState: pagination
		}
	};
};
