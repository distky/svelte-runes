import { goto } from '$app/navigation';
import BadgeCell from '$lib/components/badge-cell.svelte';
import {
	getCoreRowModel,
	getPaginationRowModel,
	type ColumnDef,
	type PaginationState,
	type Table
} from '@tanstack/table-core';
import type { Pokemon } from './schema';
import { createTable, renderComponent } from '$lib/components/page/tanstack-table';

export default function createTableState(
	data: Pokemon[],
	dataCount: number,
	paginationState: PaginationState & { hasNext: boolean; hasPrevious: boolean }
) {
	let results = $state(data);
	let count = $state(dataCount ?? 0);
	let pagination = $state(paginationState);
	let isLoading = $state({
		next: false,
		prev: false
	});
	let globalFilter = $state('');

	const onPaginate = $derived(async (offset: number, type: 'next' | 'prev', pageUrl: string) => {
		isLoading = { ...isLoading, [type]: true };

		await goto(`${pageUrl}?limit=${pagination.pageSize}&offset=${offset}&filter=${globalFilter}`, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});

		pagination = {
			...pagination,
			pageIndex: offset
		};

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
				return renderComponent(BadgeCell, {
					test: info.getValue<'url'>()
				});
			},
			header: () => 'URL'
		}
	]);

	const tableConfig: Table<Pokemon> = $derived(
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

	const handleServerSideFilter = $derived(
		async (
			e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement },
			pageUrl: string
		) => {
			globalFilter = e.currentTarget.value;
			await goto(
				`${pageUrl}?limit=${pagination.pageSize}&offset=${pagination.pageIndex}&filter=${globalFilter}`,
				{
					replaceState: true,
					keepFocus: true,
					noScroll: true
				}
			);
		}
	);

	return {
		get table() {
			return tableConfig;
		},
		set updateTable({
			data,
			dataCount,
			paginationState
		}: {
			data: Pokemon[];
			dataCount: number;
			paginationState: PaginationState & { hasNext: boolean; hasPrevious: boolean };
		}) {
			results = data;
			count = dataCount;
			pagination = paginationState;
		},
		get dataCount() {
			return dataCount;
		},
		get pagination() {
			return pagination;
		},
		get isLoading() {
			return isLoading;
		},
		get onPaginate() {
			return onPaginate;
		},
		get handleServerSideFilter() {
			return handleServerSideFilter;
		}
	};
}
