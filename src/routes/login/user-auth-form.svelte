<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { SpinnerGap } from 'phosphor-svelte';

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div class="flex items-center justify-center py-12">
	<div class="mx-auto grid w-[350px] gap-6">
		<div class="grid gap-2 text-center">
			<h1 class="text-3xl font-bold">Login</h1>
			<p class="text-balance text-muted-foreground">
				Enter your email below to login to your account
			</p>
		</div>
		<form on:submit|preventDefault={onSubmit}>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
					</div>
					<Input id="password" type="password" required />
				</div>
				<Button type="submit" class="w-full" disabled={isLoading}>
					{#if isLoading}
						<SpinnerGap class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Sign In with Email
				</Button>
			</div>
		</form>
	</div>
</div>
