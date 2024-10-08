<script lang="ts">
	import { page } from '$app/stores';
	import { SpinnerGap } from '$lib/components/icons';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { type Table as SvelteTable } from '@tanstack/table-core';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import type { PageData } from './$types';
	import createTableState from './config.svelte';
	import type { JsonPlaceholderPartial, JsonPlaceholderWithChildren } from './schema';
	import { FlexRender } from '$lib/components/page/tanstack-table';

	let { data }: { data: PageData } = $props();
	let currentUrl = $page.url.pathname;
	let tableState = createTableState(
		data.fetchData.paginationData.results,
		data.fetchData.paginationData.count,
		data.fetchData.paginationState
	);

	$effect(() => {
		tableState.updateTable = {
			paginationState: data.fetchData.paginationState,
			data: data.fetchData.paginationData.results,
			dataCount: data.fetchData.paginationData.count
		};
	});
</script>

<Tabs.Root value="all">
	<div class="flex items-center">
		<Tabs.List>
			<Tabs.Trigger value="all">All</Tabs.Trigger>
			<Tabs.Trigger value="active">Active</Tabs.Trigger>
			<Tabs.Trigger value="draft">Draft</Tabs.Trigger>
			<Tabs.Trigger value="archived" class="hidden sm:flex">Archived</Tabs.Trigger>
		</Tabs.List>
		<div class="ml-auto flex items-center gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="sm" class="h-8 gap-1">
						<ListFilter class="h-3.5 w-3.5" />
						<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Filter </span>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>Filter by</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.CheckboxItem checked>Active</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem>Draft</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem>Archived</DropdownMenu.CheckboxItem>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Button size="sm" variant="outline" class="h-8 gap-1">
				<File class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Export </span>
			</Button>
			<Button size="sm" class="h-8 gap-1">
				<CirclePlus class="h-3.5 w-3.5" />
				<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Product </span>
			</Button>
		</div>
	</div>
	<input
		type="text"
		placeholder="Global filter"
		class="w-full border p-1"
		onkeyup={(e) => tableState.handleServerSideFilter(e, currentUrl)}
	/>
	<Tabs.Content value="all">
		<Card.Root>
			<Card.Header>
				<Card.Title>Json Placeholder</Card.Title>
				<Card.Description>View your posts.</Card.Description>
			</Card.Header>
			<Card.Content>
				<DataTable table={tableState.table}>
					{#snippet tableRow(table: SvelteTable<JsonPlaceholderWithChildren>)}
						{#each table.getRowModel().rows as row}
							<Table.Row>
								{#each row.getVisibleCells() as cell}
									<Table.Cell class="font-medium">
										<FlexRender context={cell.getContext()} content={cell.column.columnDef.cell} />
									</Table.Cell>
								{/each}
							</Table.Row>
							{#if tableState.isRowExpanded(row.original.id)}
								<Table.Row>
									<Table.Cell colspan={row.getVisibleCells().length}>
										<DataTable
											table={tableState.subTable(row.original.children as JsonPlaceholderPartial[])}
										/>
									</Table.Cell>
								</Table.Row>
							{/if}
						{/each}
					{/snippet}
				</DataTable>
			</Card.Content>
			<Card.Footer>
				<div class="flex items-center justify-end space-x-4 py-4">
					<Button
						variant="outline"
						size="sm"
						on:click={() => {
							tableState.onPaginate(
								tableState.pagination.pageIndex - tableState.pagination.pageSize,
								'prev',
								currentUrl
							);
						}}
						disabled={!tableState.pagination.hasPrevious ||
							tableState.isLoading.next ||
							tableState.isLoading.prev}
					>
						Previous
						{#if tableState.isLoading.prev}
							<SpinnerGap class="ml-2 h-4 w-4 animate-spin" />
						{/if}
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={!tableState.pagination.hasNext ||
							tableState.isLoading.prev ||
							tableState.isLoading.next}
						on:click={() => {
							tableState.onPaginate(
								tableState.pagination.pageIndex + tableState.pagination.pageSize,
								'next',
								currentUrl
							);
						}}
					>
						Next
						{#if tableState.isLoading.next}
							<SpinnerGap class="ml-2 h-4 w-4 animate-spin" />
						{/if}
					</Button>
				</div>
				<div class="text-xs text-muted-foreground">
					Showing <strong
						>{tableState.pagination.pageIndex + 1}-{tableState.pagination.pageIndex +
							tableState.pagination.pageSize}</strong
					>
					of
					<strong>{tableState.dataCount}</strong> posts
				</div>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
