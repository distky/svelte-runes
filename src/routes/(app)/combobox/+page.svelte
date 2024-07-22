<script lang="ts" context="module">
	import { z } from 'zod';

	const fruits = {
		none: 'None',
		mango: 'Mango',
		watermelon: 'Watermelon',
		apple: 'Apple',
		pineapple: 'Pineapple',
		orange: 'Orange'
	} as const;

	type Fruit = keyof typeof fruits;

	const fruitList = [
		...Object.entries(fruits).map(([value, label]) => {
			return { label: label, value: value, disabled: false };
		})
	];

	export const formSchema = z.object({
		favoriteFruit: z.enum(
			Object.keys(fruits).filter((value) => value !== 'none') as [Fruit, ...Fruit[]]
		),
		defaultFruit: z.enum(
			Object.keys(fruits).filter((value) => value !== 'none') as [Fruit, ...Fruit[]]
		),
		multiFruits: z
			.enum(Object.keys(fruits).filter((value) => value !== 'none') as [Fruit, ...Fruit[]])
			.array()
			.min(1),
		testString: z.string().min(1).max(5)
	});
	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { CaretDown, X } from '$lib/components/icons/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Combobox from '$lib/components/ui/combobox/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { stringProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from '../combobox/$types';

	let { data }: { data: PageData } = $props();

	const form = $state(
		superForm(data.form, {
			validators: zodClient(formSchema),
			resetForm: true,
			onError: ({ result }) => {
				console.log(result.status, result.type, result.error);
			},
			onUpdate({ result }) {
				console.log(result.status, result.type, result.data);
			},
			onUpdated: ({ form: f }) => {
				if (f.valid) {
					toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
					$favoriteFruitProxy = '';
					$defaultFruitProxy = '';
					$formData.multiFruits = [];
					selectedMultiFruits = [];
				} else {
					toast.error('Please fix the errors in the form.');
				}
			}
		})
	);

	let { form: formData, enhance } = $derived(form);

	let inputValue = $state('');
	let touchedInput = $state(false);

	let inputMultiValue = $state('');
	let touchedMultiInput = $state(false);

	let fruitsWithoutNone = $state(fruitList.filter((fruit) => fruit.label !== 'None'));

	let filteredFruits = $derived(
		inputValue && touchedInput
			? fruitsWithoutNone.filter((fruit) => fruit.value.includes(inputValue.toLowerCase()))
			: fruitsWithoutNone
	);

	let filteredMultiFruits = $derived(
		inputMultiValue && touchedMultiInput
			? fruitsWithoutNone.filter((fruit) => fruit.value.includes(inputMultiValue.toLowerCase()))
			: fruitsWithoutNone
	);

	let selectedFavoriteFruit: { label: string; value: string } | undefined = $state(undefined);
	let selectedDefaultFruit: { label: string; value: string } | undefined = $state(undefined);
	let selectedMultiFruits: { label: string; value: Fruit }[] = $state([]);

	const favoriteFruitProxy = stringProxy(form, 'favoriteFruit', {
		taint: false,
		empty: 'undefined'
	});

	const defaultFruitProxy = stringProxy(form, 'defaultFruit', {
		taint: false,
		empty: 'undefined'
	});

	let openSelect = $state(false);

	$effect(() => {
		if (!touchedInput) {
			if (!$favoriteFruitProxy) {
				selectedFavoriteFruit = undefined;
			}
			inputValue = selectedFavoriteFruit?.label || '';

			console.log('test touchedInput');
		}

		if (!openSelect && !$defaultFruitProxy) {
			selectedDefaultFruit = undefined;
			console.log('test openSelect');
		}

		if (!touchedMultiInput) {
			console.log($formData.multiFruits);
			console.log('test touchedMultiInput');
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
					{#key selectedFavoriteFruit}
						<Combobox.Root
							bind:inputValue
							bind:touchedInput
							bind:selected={selectedFavoriteFruit}
							onSelectedChange={(selected) => selected && ($favoriteFruitProxy = selected.value)}
						>
							<div class="relative w-[180px]">
								<CaretDown
									class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-50"
								/>
								<Combobox.Input {...attrs} name={undefined} />
							</div>
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
					{/key}
				</Form.Control>
				<Form.Description>Please select your favorite fruit.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="defaultFruit">
				<Form.Control let:attrs>
					<Form.Label>Default Fruit</Form.Label>
					{#key selectedDefaultFruit}
						<Select.Root
							bind:open={openSelect}
							bind:selected={selectedDefaultFruit}
							onSelectedChange={(v) => v && ($defaultFruitProxy = v.value)}
						>
							<Select.Trigger {...attrs} class="w-[180px]">
								<Select.Value placeholder="Select a fruit" />
							</Select.Trigger>
							<Select.Content>
								{#each fruitsWithoutNone as fruit}
									<Select.Item value={fruit.value} label={fruit.label} disabled={fruit.disabled} />
								{/each}
							</Select.Content>
						</Select.Root>
					{/key}
					<input hidden bind:value={$defaultFruitProxy} name={attrs.name} />
				</Form.Control>
				<Form.Description>Please select your default fruit.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="multiFruits">
				<Form.Control let:attrs>
					<Form.Label>Favorite Fruit</Form.Label>
					<Combobox.Root
						bind:inputValue={inputMultiValue}
						bind:touchedInput={touchedMultiInput}
						bind:selected={selectedMultiFruits}
						multiple
						onSelectedChange={(selected) => {
							if (selected) {
								let temp: Fruit[] = [];
								selected.map(({ value }) => {
									temp = [...temp, value];
								});
								$formData.multiFruits = temp;
							}
						}}
					>
						<div
							class="relative flex w-full flex-row flex-wrap gap-2.5 rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
						>
							{#each selectedMultiFruits as selectedFruits}
								<div class="flex items-center overflow-hidden rounded-md [word-break:break-word]">
									<span class="flex items-center border-r border-border/10 px-1.5"
										>{selectedFruits.label}</span
									>
									<button class="flex h-full items-center px-1">
										<X class="size-3" />
									</button>
								</div>
							{/each}
							<CaretDown
								class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-50"
							/>
							<Combobox.Input
								{...attrs}
								name={undefined}
								class="min-w-[4.5rem] grow basis-0 border-0 outline-none focus:!ring-0 focus-visible:ring-transparent"
							/>
						</div>
						<!-- <div
							class="flex h-10 w-full min-w-[280px] flex-row flex-wrap gap-2.5 rounded-md border border-input bg-background px-3 py-2 text-sm text-primary-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring focus-within:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50"
						>
							<ComboboxPrimitive.Input
								{...attrs}
								name={undefined}
								type="text"
								placeholder="Enter tags..."
								class="min-w-[4.5rem] shrink grow basis-0 border-0 text-black outline-none focus:!ring-0"
							/>
						</div> -->
						{#each $formData.multiFruits as multi}
							<input hidden value={multi} name={attrs.name} />
						{/each}
						<Combobox.Content>
							<Combobox.Group>
								<Combobox.Label>Fruits</Combobox.Label>
								{#each filteredMultiFruits as fruit (fruit.value)}
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

			<Form.Field {form} name="testString">
				<Form.Control let:attrs>
					<Form.Label>Test</Form.Label>
					<Input {...attrs} type="text" />
				</Form.Control>
			</Form.Field>

			<Form.Button type="submit">Submit</Form.Button>
			<Button
				disabled={fruitsWithoutNone.filter((fruit) => fruit.value === 'test').length > 0}
				on:click={() => {
					fruitsWithoutNone = [
						...fruitsWithoutNone,
						{ label: 'Mango', value: 'test', disabled: false }
					];
				}}>Test</Button
			>
		</form>

		{#if browser && dev}
			<SuperDebug data={$formData} />
		{/if}
	</Card.Content>
</Card.Root>
<Toaster position="top-right" />
