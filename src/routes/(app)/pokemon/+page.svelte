<script lang="ts">
	import { page } from '$app/stores';
	import { SpinnerGap } from '$lib/components/icons';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { FlexRender, type Table as SvelteTable } from '@tanstack/svelte-table';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import type { PageData } from './$types';
	import createTableState from './config.svelte';
	import type { Pokemon } from './schema';

	let { data }: { data: PageData } = $props();
	let tableState = createTableState(
		data.fetchData.paginationData.results,
		data.fetchData.paginationData.count,
		data.fetchData.paginationState
	);

	$effect(() => {
		tableState.pagination = data.fetchData.paginationState;
		tableState.data = data.fetchData.paginationData.results;
		tableState.dataCount = data.fetchData.paginationData.count;
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
	<Tabs.Content value="all">
		<Card.Root>
			<Card.Header>
				<Card.Title>Pokemon</Card.Title>
				<Card.Description>View your pokemon.</Card.Description>
			</Card.Header>
			<Card.Content>
				<DataTable table={tableState.table} {tableHeader} {tableRow}></DataTable>
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
								$page.url.pathname
							);
						}}
						disabled={!data.fetchData.paginationData.previous ||
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
						disabled={!data.fetchData.paginationData.next ||
							tableState.isLoading.prev ||
							tableState.isLoading.next}
						on:click={() => {
							tableState.onPaginate(
								tableState.pagination.pageIndex + tableState.pagination.pageSize,
								'next',
								$page.url.pathname
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
					<strong>{tableState.dataCount}</strong> pokemon
				</div>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>

{#snippet tableHeader(table: SvelteTable<Pokemon>)}
	{#each table.getHeaderGroups() as headerGroup}
		<Table.Row>
			{#each headerGroup.headers as header}
				<Table.Head>
					{#if !header.isPlaceholder}
						<FlexRender context={header.getContext()} content={header.column.columnDef.header}
						></FlexRender>
					{:else}
						""
					{/if}
				</Table.Head>
			{/each}
		</Table.Row>
	{/each}
{/snippet}

{#snippet tableRow(table: SvelteTable<Pokemon>)}
	{#each table.getRowModel().rows as row}
		<Table.Row>
			{#each row.getVisibleCells() as cell}
				<Table.Cell class="font-medium">
					<FlexRender context={cell.getContext()} content={cell.column.columnDef.cell} />
				</Table.Cell>
			{/each}
		</Table.Row>
	{/each}
{/snippet}
