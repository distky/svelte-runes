<script lang="ts">
	import { cn } from '$lib/utils';
	import { Combobox as ComboboxPrimitive } from 'bits-ui';

	type $$Props = ComboboxPrimitive.InputProps;
	type $$Events = ComboboxPrimitive.InputEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<ComboboxPrimitive.Input
	class={cn(
		'block h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-destructive [&>span]:line-clamp-1 data-[placeholder]:[&>span]:text-muted-foreground',
		className
	)}
	{...$$restProps}
></ComboboxPrimitive.Input>
