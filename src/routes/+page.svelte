<script>
	import Cube from 'phosphor-svelte/lib/Cube';
</script>

<Cube color="darkorchid" weight="duotone">
	<animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite"></animate>
	<animateTransform
		attributeName="transform"
		attributeType="XML"
		type="rotate"
		dur="5s"
		from="0 0 0"
		to="360 0 0"
		repeatCount="indefinite"
	></animateTransform>
</Cube>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
