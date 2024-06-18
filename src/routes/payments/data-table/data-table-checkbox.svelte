<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { Writable } from 'svelte/store';

	let { checked } = $props<{ checked: Writable<boolean> }>();
</script>

<Checkbox bind:checked={$checked} />
