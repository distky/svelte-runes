<script lang="ts" generics="T">
	import Button from './ui/button/button.svelte';

	type Props = {
		isAllRowExpanded: boolean;
		toggleAllRowExpanded: () => void;
		header: string;
	};

	let { isAllRowExpanded, header, toggleAllRowExpanded }: Props = $props();
</script>

<div>
	<Button onclick={toggleAllRowExpanded}>{isAllRowExpanded ? '👇' : '👉'}</Button>{' '}{header}
</div>
