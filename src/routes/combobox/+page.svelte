<script lang="ts" context="module">
	import { z } from 'zod';

	const fruits = {
		mango: 'Mango',
		watermelon: 'Watermelon',
		apple: 'Apple',
		pineapple: 'Pineapple',
		orange: 'Orange'
	} as const;

	type Fruit = keyof typeof fruits;

	const fruitList = [
		{ label: 'None', value: undefined, disabled: true },
		...Object.entries(fruits).map(([value, label]) => {
			return { label: label, value: value, disabled: false };
		})
	];

	export const formSchema = z.object({
		favoriteFruit: z.enum(Object.keys(fruits) as [Fruit, ...Fruit[]]),
		defaultFruit: z.enum(Object.keys(fruits) as [Fruit, ...Fruit[]])
	});
	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Combobox from '$lib/components/ui/combobox/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
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
			? fruitList.filter((fruit) => fruit.value?.includes(inputValue.toLowerCase()))
			: fruitList
	);

	let selectedFavoriteFruit: { label: string; value: string } | undefined = $state(undefined);
	let selectedDefaultFruit: { label: string; value: string } | undefined = $state(undefined);

	const favoriteFruitProxy = stringProxy(form, 'favoriteFruit', {
		taint: false,
		empty: 'undefined'
	});

	const defaultFruitProxy = stringProxy(form, 'defaultFruit', {
		taint: false,
		empty: 'undefined'
	});

	$effect(() => {
		if (!touchedInput) {
			if (!$favoriteFruitProxy) {
				selectedFavoriteFruit = undefined;
			}
			inputValue = selectedFavoriteFruit?.label || '';
		}
	});

	let openSelect = $state(false);

	$effect(() => {
		if (!openSelect && !$defaultFruitProxy) {
			selectedDefaultFruit = undefined;
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Combobox Preview</Card.Title>
		<Card.Description>Test your combobox.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" class="w-2/3 space-y-6" use:enhance>
			<Form.Field {form} name="favoriteFruit">
				<Form.Control let:attrs>
					<Form.Label>Favorite Fruit</Form.Label>
					<Combobox.Root
						bind:inputValue
						bind:touchedInput
						bind:selected={selectedFavoriteFruit}
						items={fruitList}
						onSelectedChange={(selected) =>
							selected?.value && ($favoriteFruitProxy = selected.value)}
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
										disabled={fruit.disabled}
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
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="defaultFruit">
				<Form.Control let:attrs>
					<Form.Label>Default Fruit</Form.Label>
					<Select.Root
						items={fruitList}
						bind:open={openSelect}
						bind:selected={selectedDefaultFruit}
						onSelectedChange={(v) => v?.value && ($defaultFruitProxy = v.value)}
					>
						<Select.Trigger {...attrs} class="w-[180px]">
							<Select.Value placeholder="Select a fruit" />
						</Select.Trigger>
						<Select.Content>
							{#each fruitList as fruit}
								<Select.Item value={fruit.value} label={fruit.label} disabled={fruit.disabled} />
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$defaultFruitProxy} name={attrs.name} />
				</Form.Control>
				<Form.Description>Please select your default fruit.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit">Submit</Form.Button>
		</form>

		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Card.Content>
</Card.Root>
