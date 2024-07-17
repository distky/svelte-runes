<script lang="ts">
	import { Badge } from './ui/badge';

	let { test }: { test: string } = $props();
</script>

<Badge>{test}</Badge>
