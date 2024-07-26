<script lang="ts">
	import type { TreeData } from '$lib/components/page/tree-view.svelte';
	import TreeView from '$lib/components/page/tree-view.svelte';

	let tree_data: TreeData = [
		{
			name: 'Group',
			selected: true,
			children: [
				{
					name: 'Sub Group',
					children: [
						{
							name: 'Item 1.1.1'
						},
						{
							name: 'Item 1.1.2'
						}
					]
				},
				{
					name: 'Group'
				}
			]
		},
		{
			name: 'Item 2',
			children: [
				{
					name: 'Item 2.1'
				},
				{
					name: 'Item 2.2'
				}
			]
		},
		{
			name: 'Item 3'
		}
	];

	function duplicateItem(list: any[], id: number) {
		list.splice(id + 1, 0, JSON.parse(JSON.stringify(list[id])));

		tree_data = tree_data;
	}

	function deleteItem(list: any[], id: number) {
		list.splice(id, 1);

		tree_data = tree_data;
	}

	function addItem(list: any[], id: number) {
		// Ensure that the children array exists
		if (!list[id].children) {
			list[id].children = [];
		}

		list[id].children.splice(
			id + 1,
			0,
			JSON.parse(
				JSON.stringify({
					name: 'New Item'
				})
			)
		);

		tree_data = tree_data;
	}

	function addItemAtRoot() {
		tree_data.splice(
			tree_data.length,
			0,
			JSON.parse(
				JSON.stringify({
					name: 'New Item'
				})
			)
		);

		tree_data = tree_data;
	}

	function renameItem(list: any[], id: number, name: string) {
		list[id].name = name;

		tree_data = tree_data;
	}
</script>

<div class="min-h-screen bg-neutral-800 text-neutral-200">
	<div class="mx-auto flex h-full max-w-6xl flex-col p-5">
		<h1 class="mb-9 text-3xl">Tree View with Svelte</h1>

		<div class="grid grow grid-cols-2 gap-5">
			<div class="rounded-md border border-green-500 bg-green-950/50 p-6">
				<div
					class="mb-5 flex overflow-hidden rounded-md border border-neutral-700 bg-neutral-900 text-neutral-500"
				>
					<button
						on:click={() => {
							addItemAtRoot();
						}}
						class="px-2 py-1 transition-all hover:bg-green-800/50 hover:text-green-100/50"
						>Add File</button
					>
				</div>
				<div>
					<TreeView {tree_data} let:item let:list let:id>
						<div class="group flex w-full border-b border-b-green-900 py-2">
							<div class="flex grow gap-2">
								{#if item.children && item.children.length > 0}
									📁 <div class="text-neutral-500">{item.children.length}</div>
								{:else}
									📄
								{/if}
								<input
									type="text"
									value={item.name}
									class="w-full shrink grow bg-transparent px-1 focus:outline-none focus:ring-0"
									style="width: fit-content;"
									on:input={(ev) => {
										renameItem(list, id, ev.currentTarget.value);
									}}
								/>
								<div
									class="flex overflow-hidden rounded-md border border-neutral-700 bg-neutral-900 text-xs text-neutral-500 opacity-0 transition-all group-hover:opacity-100"
								>
									<button
										on:click={() => {
											addItem(list, id);
										}}
										class="px-2 py-1 transition-all hover:bg-green-800/50 hover:text-green-100/50"
										>Add File</button
									>
									<button
										on:click={() => {
											duplicateItem(list, id);
										}}
										class="px-2 py-1 transition-all hover:bg-blue-800/50 hover:text-blue-100/50"
										>Duplicate</button
									>
									<button
										on:click={() => {
											deleteItem(list, id);
										}}
										class="px-2 py-1 transition-all hover:bg-red-800/50 hover:text-red-100/50"
										>Delete</button
									>
								</div>
							</div>
						</div></TreeView
					>
				</div>
			</div>
			<div
				class="grid grid-cols-2 divide-x divide-blue-500 rounded-md border border-blue-500 bg-blue-950/50"
			>
				<div class="p-6">
					<div class="mb-2 text-xl font-bold">Raw</div>
					<TreeView {tree_data} />
				</div>

				<div class="p-6">
					<div class="mb-2 text-xl font-bold">Styled</div>
					<TreeView {tree_data} let:item>
						<div class="group flex w-full border-b border-b-blue-700 py-2">
							{#if item.children}
								<div class="grow">
									📁 {item.name}
								</div>
							{:else}
								<div class="grow">
									📝 {item.name}
								</div>
							{/if}
						</div>
					</TreeView>
				</div>
			</div>
			<div>
				<pre class="mt-5 rounded-md border border-neutral-600 bg-neutral-900 p-5">{JSON.stringify(
						tree_data,
						null,
						2
					)}</pre>
			</div>
		</div>
	</div>
</div>
