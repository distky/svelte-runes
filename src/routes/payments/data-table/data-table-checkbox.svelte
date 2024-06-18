<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { Writable } from 'svelte/store';

	let { checked }: { checked: Writable<boolean> } = $props();
</script>

<Checkbox bind:checked={$checked} />
