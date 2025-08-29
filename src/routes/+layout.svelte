<script>
	import '@fontsource-variable/inter';
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { apiUrl } from '$lib/stores/chats';

	let { children } = $props();
</script>

<svelte:head>
	<meta
		http-equiv="content-security-policy"
		content={`
		default-src 'self';
		script-src 'self' 'unsafe-inline';
		connect-src 'self' ${$apiUrl};
		style-src 'self' 'unsafe-inline';
		img-src 'self' data:;
		font-src 'self';
	`}
	/>

	<link rel="preconnect" href={$apiUrl} />
	<link rel="dns-prefetch" href={$apiUrl} />
</svelte:head>

<div class="flex h-screen bg-ConversationViewbg text-Font">
	<Sidebar />
	<main class="flex-1 overflow-y-auto p-4">
		{@render children()}
	</main>
</div>

<ErrorMessage />
