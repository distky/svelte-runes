<script lang="ts">
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import type { PageData } from './$types';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as DataTable from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import {
		createTable,
		FlexRender,
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type Table
	} from '@tanstack/svelte-table';
	import type { Pokemon } from './schema';

	let { data }: { data: PageData } = $props();

	const { fetchData } = $state(data);

	let pagination = $state(fetchData);

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
			cell: (info) => info.getValue(),
			header: () => 'URL'
		}
	]);

	let table: Table<Pokemon> = $derived(
		createTable({
			columns: columns,
			data: pagination.results,
			getPaginationRowModel: getPaginationRowModel(),
			manualPagination: true,
			rowCount: fetchData.count,
			state: {
				pagination: {
					pageIndex: 0,
					pageSize: 10
				}
			},
			getCoreRowModel: getCoreRowModel()
		})
	);

	$effect(() => {
		pagination.results = fetchData.results;
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
				<DataTable.Root>
					<DataTable.Header>
						{#each table.getHeaderGroups() as headerGroup}
							<DataTable.Row>
								{#each headerGroup.headers as header}
									<DataTable.Head>
										{#if !header.isPlaceholder}
											<FlexRender
												context={header.getContext()}
												content={header.column.columnDef.header}
											></FlexRender>
										{:else}
											""
										{/if}
									</DataTable.Head>
								{/each}
							</DataTable.Row>
						{/each}
					</DataTable.Header>
					<DataTable.Body>
						{#each table.getRowModel().rows as row}
							<DataTable.Row>
								{#each row.getVisibleCells() as cell}
									<DataTable.Cell class="font-medium">
										<FlexRender context={cell.getContext()} content={cell.column.columnDef.cell} />
									</DataTable.Cell>
								{/each}
							</DataTable.Row>
						{/each}
					</DataTable.Body>
				</DataTable.Root>
			</Card.Content>
			<Card.Footer>
				<div class="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>32</strong> products
				</div>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
