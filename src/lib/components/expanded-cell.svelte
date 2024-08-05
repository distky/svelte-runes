<script lang="ts" generics="T">
	import type { Getter, Row } from '@tanstack/svelte-table';
	import Button from './ui/button/button.svelte';

	type Props = {
		row: Row<T>;
		toggleExpanded: () => void;
		getValue: Getter<unknown>;
	};

	let { row, getValue, toggleExpanded }: Props = $props();
</script>

<div class="pl-[{row.depth * 2}rem]">
	<div>
		{#if row.getCanExpand()}
			<Button onclick={toggleExpanded}>{row.getIsExpanded() ? '👇' : '👉'}</Button>
		{:else}
			🔵
		{/if}
	</div>
</div>
