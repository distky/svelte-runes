<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { form, enhance, errors, message, constraints, delayed } = superForm(data.post, {
		resetForm: false
	});

	let formData = $state($form);
	let errorsData = $state($errors);
	let messageData = $state($message);
	let delayedState = $state($delayed);
	let constraintsData = $state($constraints);

	$effect(() => {
		formData = $form;
		errorsData = $errors;
		messageData = $message;
		delayedState = $delayed;
		constraintsData = $constraints;
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Post</Card.Title>
		<Card.Description>Add/Edit your post data.</Card.Description>
	</Card.Header>
	<Card.Content>
		<SuperDebug data={formData} />
		{#if messageData}
			<h3>{messageData}</h3>
		{/if}

		<form use:enhance method="post">
			<Input class="hidden" name="id" bind:value={formData.id} />
			<Label for="title">Title</Label>
			<Input
				type="text"
				name="title"
				aria-invalid={errorsData.title ? 'true' : undefined}
				bind:value={formData.title}
				{...constraintsData.title}
			/>
			{#if errorsData.title}<span class="invalid">{errorsData.title}</span>{/if}

			<Label for="body">Body</Label>
			<Input
				type="text"
				name="body"
				aria-invalid={errorsData.body ? 'true' : undefined}
				bind:value={formData.body}
				{...constraintsData.body}
			/>
			{#if errorsData.body}<span class="invalid">{errorsData.body}</span>{/if}

			<Input class="hidden" name="userId" bind:value={formData.userId} />

			<div><Button type="submit" disabled={delayedState}>Submit</Button></div>
			<div>
				<Button
					type="button"
					onclick={(_) => {
						goto('./add');
					}}>Clear</Button
				>
			</div>
			<div>
				<Button
					type="button"
					onclick={(_) => {
						goto('./1');
					}}>Data 1</Button
				>
			</div>
			<div>
				<Button
					type="button"
					onclick={(_) => {
						goto('./2');
					}}>Data 2</Button
				>
			</div>
			<div>
				<Button
					type="button"
					onclick={(_) => {
						goto('./3');
					}}>Data 3</Button
				>
			</div>
		</form>
	</Card.Content>
</Card.Root>
