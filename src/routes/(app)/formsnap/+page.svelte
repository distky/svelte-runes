<script lang="ts">
	import type { PageData } from './$types';
	import * as From from '$lib/components/ui/form/index.js';
	import { superForm } from 'sveltekit-superforms';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	const { enhance, form: formData } = superForm(data.form);
</script>

<form use:enhance>


</form>
