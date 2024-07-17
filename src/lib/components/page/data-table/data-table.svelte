<script lang="ts" generics="T">
	import * as DataTable from '$lib/components/ui/table';
	import { FlexRender, type Table } from '@tanstack/svelte-table';
	import type { Snippet } from 'svelte';

	let {
		table,
		tableHeader,
		tableRow
	}: { table: Table<T>; tableHeader?: Snippet<[Table<T>]>; tableRow?: Snippet<[Table<T>]> } =
		$props();
</script>

<DataTable.Root>
	<DataTable.Header>
		{#if tableHeader}
			{@render tableHeader(table)}
		{:else}
			{#each table.getHeaderGroups() as headerGroup}
				<DataTable.Row>
					{#each headerGroup.headers as header}
						<DataTable.Head>
							{#if !header.isPlaceholder}
								<FlexRender context={header.getContext()} content={header.column.columnDef.header}
								></FlexRender>
							{:else}
								""
							{/if}
						</DataTable.Head>
					{/each}
				</DataTable.Row>
			{/each}
		{/if}
	</DataTable.Header>
	<DataTable.Body>
		{#if tableRow}
			{@render tableRow(table)}
		{:else}
			{#each table.getRowModel().rows as row}
				<DataTable.Row>
					{#each row.getVisibleCells() as cell}
						<DataTable.Cell class="font-medium">
							<FlexRender context={cell.getContext()} content={cell.column.columnDef.cell} />
						</DataTable.Cell>
					{/each}
				</DataTable.Row>
			{/each}
		{/if}
	</DataTable.Body>
</DataTable.Root>
