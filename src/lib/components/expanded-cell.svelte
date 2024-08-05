<script lang="ts" generics="T">
	import Button from './ui/button/button.svelte';

	type Props = {
		canExpand: boolean;
		isExpanded: boolean;
		toggleExpanded: () => void;
	};

	let { canExpand, isExpanded, toggleExpanded }: Props = $props();
</script>

<div>
	{#if canExpand}
		<Button onclick={toggleExpanded}>{isExpanded ? '👇' : '👉'}</Button>
	{:else}
		🔵
	{/if}
</div>
