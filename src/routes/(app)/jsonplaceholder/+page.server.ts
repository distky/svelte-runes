import type { PaginationState } from '@tanstack/svelte-table';
import type { PageServerLoad } from './$types';
import {
	jsonPlaceholderSchema,
	makeData,
	type JsonPlaceholder,
	type JsonPlaceholderPaginated
} from './schema';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const limit: number = Number(url.searchParams.get('limit') ?? 10);
	const offset: number = Number(url.searchParams.get('offset') ?? 0);
	const filter: string | undefined = url.searchParams.get('filter') ?? undefined;
	const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);

	const fetchData: JsonPlaceholder[] = jsonPlaceholderSchema.array().parse(await response.json());

	const data = makeData(fetchData, 20, 10);

	const paginatedData: JsonPlaceholderPaginated = {
		results: data,
		count: data.length
	};

	paginatedData.results = paginatedData.results.slice(offset, offset + limit);

	if (filter) {
		paginatedData.results = paginatedData.results.filter((result) =>
			result.title.toUpperCase().includes(filter.toUpperCase())
		);
		paginatedData.count = paginatedData.results.length;
	}

	const pagination: PaginationState & { hasNext: boolean; hasPrevious: boolean } = {
		pageIndex: offset,
		pageSize: limit,
		hasNext: offset + limit < paginatedData.count,
		hasPrevious: offset > 0
	};

	return {
		fetchData: {
			paginationData: paginatedData,
			paginationState: pagination
		}
	};
};
