<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = ComboboxPrimitive.ItemProps;
	type $$Events = ComboboxPrimitive.ItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export let label: $$Props['label'] = undefined;
	export let disabled: $$Props['disabled'] = undefined;
	export { className as class };
</script>

<ComboboxPrimitive.Item
	{value}
	{disabled}
	{label}
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<ComboboxPrimitive.ItemIndicator>
			<Check class="h-4 w-4" />
		</ComboboxPrimitive.ItemIndicator>
	</span>
	<slot>
		{label || value}
	</slot>
</ComboboxPrimitive.Item>
