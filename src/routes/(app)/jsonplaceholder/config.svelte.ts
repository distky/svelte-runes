import { goto } from '$app/navigation';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	type ColumnDef,
	type PaginationState,
	type Table
} from '@tanstack/svelte-table';
import type { JsonPlaceholderWithChildren } from './schema';

export default function createTableState(
	data: JsonPlaceholderWithChildren[],
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

	const columns: ColumnDef<JsonPlaceholderWithChildren>[] = $state([
		{
			id: 'id',
			accessorFn: (row) => row.id,
			cell: (info) => info.getValue(),
			header: () => 'Id'
		},
		{
			accessorFn: (row) => row.title,
			id: 'title',
			cell: (info) => info.getValue(),
			header: () => 'Title'
		},
		{
			accessorFn: (row) => row.userId,
			id: 'userId',
			cell: (info) => info.getValue(),
			header: () => 'User Id'
		}
	]);

	const tableConfig: Table<JsonPlaceholderWithChildren> = $derived(
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
			data: JsonPlaceholderWithChildren[];
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
