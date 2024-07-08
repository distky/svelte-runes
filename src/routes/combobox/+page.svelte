<script lang="ts" context="module">
	import { z } from 'zod';

	export const formSchema = z.object({
		favoriteFruit: z.string().min(2).max(50).optional(),
		defaultFruit: z.string()
	});
	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Combobox from '$lib/components/ui/combobox/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	const form = $state(
		superForm(data.form, {
			validators: zodClient(formSchema),
			onUpdated: ({ form: f }) => {
				if (f.valid) {
					toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				} else {
					toast.error('Please fix the errors in the form.');
				}
			}
		})
	);

	let { form: formData, enhance } = $derived(form);

	const fruits = [
		{ value: 'mango', label: 'Mango' },
		{ value: 'watermelon', label: 'Watermelon' },
		{ value: 'apple', label: 'Apple' },
		{ value: 'pineapple', label: 'Pineapple' },
		{ value: 'orange', label: 'Orange' }
	];

	let inputValue = $state('');
	let touchedInput = $state(false);

	let filteredFruits = $derived(
		inputValue && touchedInput
			? fruits.filter((fruit) => fruit.value.includes(inputValue.toLowerCase()))
			: fruits
	);

	let selected: { value: string; label: string } | undefined = $state(undefined);

	$effect(() => {
		if (selected && !touchedInput) {
			inputValue = selected.label;
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Pokemon</Card.Title>
		<Card.Description>View your pokemon.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" class="w-2/3 space-y-6" use:enhance>
			<Form.Field {form} name="favoriteFruit">
				<Form.Control let:attrs>
					<Form.Label>Favorite Fruit</Form.Label>
					<Combobox.Root
						bind:inputValue
						bind:touchedInput
						bind:selected
						onSelectedChange={(selected) => {
							if (selected) {
								$formData.favoriteFruit = selected.value;
							} else {
								$formData.favoriteFruit = undefined;
							}
						}}
					>
						<Combobox.Input
							class="w-[180px]"
							placeholder="Search a fruit"
							aria-label="Search a fruit"
							{...attrs}
							><Combobox.HiddenInput
								bind:value={$formData.favoriteFruit}
								name={attrs.name}
							/></Combobox.Input
						>
						<Combobox.Content>
							<Combobox.Group>
								<Combobox.Label>Fruits</Combobox.Label>
								{#each filteredFruits as fruit (fruit.value)}
									<Combobox.Item value={fruit.value} label={fruit.label}
										>{fruit.label}</Combobox.Item
									>
								{:else}
									<span class="block px-5 py-2 text-sm text-muted-foreground">
										No results found
									</span>
								{/each}
							</Combobox.Group>
						</Combobox.Content>
					</Combobox.Root>
				</Form.Control>
				<Form.Description>Please select your favorite fruit.</Form.Description>
			</Form.Field>
		</form>

		<!-- <Select.Root portal={null}>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Select a fruit" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Fruits</Select.Label>
					{#each fruits as fruit}
						<Select.Item value={fruit.value} label={fruit.label}>{fruit.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="favoriteFruit" />
		</Select.Root> -->
	</Card.Content>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</Card.Root>
