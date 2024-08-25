import { goto } from '$app/navigation';
import ExpandedCellHeader from '$lib/components/expanded-cell-header.svelte';
import ExpandedCell from '$lib/components/expanded-cell.svelte';
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	renderComponent,
	type ColumnDef,
	type ExpandedState,
	type PaginationState,
	type Table
} from '@tanstack/svelte-table';
import type { JsonPlaceholderPartial, JsonPlaceholderWithChildren } from './schema';

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
	let expanded: ExpandedState = $state({});

	const isAllRowsExpanded = $derived(typeof expanded === 'boolean' && expanded === true);

	const isRowExpanded = (id: string | number): boolean => {
		return isAllRowsExpanded || (typeof expanded === 'object' && expanded[id]);
	};

	const onPaginate = async (offset: number, type: 'next' | 'prev', pageUrl: string) => {
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
	};

	const toggleExpanded = (rowIdx: string) => {
		if (expanded === true) {
			expanded = {
				[rowIdx]: true
			};
			return;
		}
		expanded = {
			...expanded,
			[rowIdx]: !expanded[rowIdx]
		};
	};

	const subColumns: ColumnDef<JsonPlaceholderPartial>[] = [
		{
			accessorFn: (row) => row.body,
			id: 'body',
			cell: (info) => info.getValue(),
			header: () => 'Body'
		},
		{
			accessorFn: (row) => row.userId,
			id: 'userId',
			cell: (info) => info.getValue(),
			header: () => 'User Id'
		}
	];

	const subTableConfig = (row: JsonPlaceholderPartial[]): Table<JsonPlaceholderPartial> =>
		createTable({
			columns: subColumns,
			data: row,
			getCoreRowModel: getCoreRowModel(),
			rowCount: count
		});

	const columns: ColumnDef<JsonPlaceholderWithChildren>[] = $derived([
		{
			id: 'id',
			accessorFn: (row) => row.id,
			cell: ({ row }) =>
				renderComponent(ExpandedCell, {
					isExpanded: isRowExpanded(row.original.id),
					canExpand: !!row.original.children?.length,
					toggleExpanded: () => {
						toggleExpanded(String(row.original.id));
					}
				}),
			header: () =>
				renderComponent(ExpandedCellHeader, {
					isAllRowExpanded: isAllRowsExpanded,
					header: 'Id',
					toggleAllRowExpanded: () => {
						expanded = isAllRowsExpanded ? {} : true;
					}
				})
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

	const handleServerSideFilter = async (
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
	};

	return {
		get table() {
			return tableConfig;
		},
		get subTable() {
			return subTableConfig;
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
		},
		get isRowExpanded() {
			return isRowExpanded;
		}
	};
}
