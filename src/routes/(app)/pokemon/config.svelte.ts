import Cell from '$lib/components/Cell.svelte';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	renderComponent,
	type ColumnDef,
	type PaginationState
} from '@tanstack/svelte-table';
import type { Pokemon } from './schema';
import { goto } from '$app/navigation';

export default function createTableState(
	data: Pokemon[],
	dataCount: number,
	paginationState: PaginationState
) {
	let results = $state(data);
	let count = $state(dataCount ?? 0);
	let pagination = $state(
		paginationState || {
			pageIndex: 0,
			pageSize: 0
		}
	);
	let isLoading = $state({
		next: false,
		prev: false
	});

	const onPaginate = $derived(async (offset: number, type: 'next' | 'prev', pageUrl: string) => {
		isLoading = { ...isLoading, [type]: true };
		await goto(`${pageUrl}?limit=${pagination.pageSize}&offset=${offset}`, {
			invalidateAll: true,
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
		isLoading = { ...isLoading, [type]: false };
	});

	const columns: ColumnDef<Pokemon>[] = $state([
		{
			id: 'name',
			accessorFn: (row) => row.name,
			cell: (info) => info.getValue(),
			header: () => 'Name'
		},
		{
			accessorFn: (row) => row.url,
			id: 'url',
			cell: (info) => {
				return renderComponent(Cell, {
					test: info.getValue<'url'>()
				});
			},
			header: () => 'URL'
		}
	]);

	const tableConfig = $derived(
		createTable({
			columns: columns,
			data: results,
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			manualPagination: true,
			rowCount: count,
			state: {
				pagination
			}
		})
	);

	return {
		get table() {
			return tableConfig;
		},
		set data(data: Pokemon[]) {
			results = data;
		},
		get dataCount() {
			return dataCount;
		},
		set dataCount(dataCount: number) {
			count = dataCount;
		},
		get pagination() {
			return pagination;
		},
		set pagination(paginationState: PaginationState) {
			pagination = paginationState;
		},
		get isLoading() {
			return isLoading;
		},
		get onPaginate() {
			return onPaginate;
		}
	};
}
