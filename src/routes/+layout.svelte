<script>
	import '@fontsource-variable/inter';
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Ollapa</title>
</svelte:head>

<div class="flex h-screen bg-neutral-800 text-neutral-100">
	<Sidebar />
	<main class="flex-1 overflow-y-auto p-4">
		{@render children()}
	</main>
</div>
