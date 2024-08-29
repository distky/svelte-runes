<script module lang="ts">
	export interface TreeItem {
		name: string;
		children?: TreeItem[];

		// To allow custom keys
		[key: string]: any;
	}

	export type TreeData = TreeItem[];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tree_data,
		tree_leaf
	}: {
		tree_data: TreeData;
		tree_leaf?: Snippet<[{ item: TreeItem; list: TreeData; id: number }]>;
	} = $props();

	function summaryKeyup(event: KeyboardEvent) {
		if (event.key == ' ' && document.activeElement?.tagName != 'SUMMARY') {
			event.preventDefault();
		}
	}
</script>

<ul>
	{#each tree_data as item, i}
		<li>
			{#if item.children}
				<details>
					<summary class="flex" onkeyup={summaryKeyup} tabindex="0">
						{#if tree_leaf}
							{@render tree_leaf({ item, list: tree_data, id: i })}
						{:else}
							{item.name}
						{/if}
					</summary>

					{#if item.children}
						<div class="pl-8">
							<svelte:self
								tree_data={item.children}
								{tree_leaf}
								let:item
								let:list={tree_data}
								let:id={i}
							>
								{#if tree_leaf}
									{@render tree_leaf({ item, list: tree_data, id: i })}
								{:else}
									{item.name}
								{/if}
							</svelte:self>
						</div>
					{/if}
				</details>
			{:else if tree_leaf}
				{@render tree_leaf({ item, list: tree_data, id: i })}
			{:else}
				{item.name}
			{/if}
		</li>
	{/each}
</ul>
