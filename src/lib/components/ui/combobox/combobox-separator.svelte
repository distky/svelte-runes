<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = ComboboxPrimitive.SeparatorProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<ComboboxPrimitive.Separator class={cn('-mx-1 my-1 h-px bg-muted', className)} {...$$restProps} />
