<script lang="ts" context="module">
	import { z } from 'zod';

	export const formSchema = z.object({
		favoriteFruit: z.string().min(2).max(50),
		defaultFruit: z.string()
	});
	export type FormSchema = typeof formSchema;

	const fruits = [
		{ value: 'mango', label: 'Mango' },
		{ value: 'watermelon', label: 'Watermelon' },
		{ value: 'apple', label: 'Apple' },
		{ value: 'pineapple', label: 'Pineapple' },
		{ value: 'orange', label: 'Orange' }
	];
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Combobox from '$lib/components/ui/combobox/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { stringProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const form = $state(
		superForm(data.form, {
			validators: zodClient(formSchema),
			resetForm: true,
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

	let inputValue = $state('');
	let touchedInput = $state(false);

	let filteredFruits = $derived(
		inputValue && touchedInput
			? fruits.filter((fruit) => fruit.value.includes(inputValue.toLowerCase()))
			: fruits
	);

	let selected: { value: string; label: string } | undefined = $state(undefined);

	const favoriteFruitProxy = stringProxy(form, 'favoriteFruit', {
		taint: false,
		empty: 'undefined'
	});

	$effect(() => {
		if (!touchedInput) {
			if (!$favoriteFruitProxy) {
				selected = undefined;
			}
			inputValue = selected?.label || '';
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
						items={fruits}
						onSelectedChange={(selected) => {
							if (selected) {
								$favoriteFruitProxy = selected.value;
							}
							console.log('test');
						}}
					>
						<Combobox.Input
							{...attrs}
							name={undefined}
							class="w-[180px]"
							placeholder="Search a fruit"
							aria-label="Search a fruit"
						/>
						<Combobox.HiddenInput bind:value={$favoriteFruitProxy} name={attrs.name} />
						<Combobox.Content>
							<Combobox.Group>
								<Combobox.Label>Fruits</Combobox.Label>
								{#each filteredFruits as fruit (fruit.value)}
									<Combobox.Item
										value={fruit.value}
										label={fruit.label}
										data-selected={false}
										data-highlighted={false}
									/>
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
			<Form.Button type="submit">Submit</Form.Button>
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
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Card.Content>
</Card.Root>
