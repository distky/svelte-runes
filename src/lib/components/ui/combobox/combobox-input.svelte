<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	type $$Props = ComboboxPrimitive.InputProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div class={cn('relative', className)}>
	<ChevronDown
		class="pointer-events-auto absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-50"
	/>
	<ComboboxPrimitive.Input
		class={cn(
			'block h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-destructive [&>span]:line-clamp-1 data-[placeholder]:[&>span]:text-muted-foreground',
			className
		)}
		{...$$restProps}
		on:click
		on:keydown
	></ComboboxPrimitive.Input>
</div>
