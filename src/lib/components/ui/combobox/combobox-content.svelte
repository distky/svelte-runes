<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { scale } from 'svelte/transition';
	import { cn, flyAndScale } from '$lib/utils.js';

	type $$Props = ComboboxPrimitive.ContentProps;
	type $$Events = ComboboxPrimitive.ContentEvents;

	export let sideOffset: $$Props['sideOffset'] = 4;
	export let inTransition: $$Props['inTransition'] = flyAndScale;
	export let inTransitionConfig: $$Props['inTransitionConfig'] = undefined;
	export let outTransition: $$Props['outTransition'] = scale;
	export let outTransitionConfig: $$Props['outTransitionConfig'] = {
		start: 0.95,
		opacity: 0,
		duration: 50
	};

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<ComboboxPrimitive.Content
	{inTransition}
	{inTransitionConfig}
	{outTransition}
	{outTransitionConfig}
	{sideOffset}
	class={cn(
		'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
		className
	)}
	{...$$restProps}
	on:keydown
>
	<div class="w-full p-1">
		<slot />
	</div>
</ComboboxPrimitive.Content>
