<script>
	import { page } from '$app/stores';
	import { chats } from '$lib/stores/chats';

	const selectedChat = $derived($chats.find((chat) => chat.id === $page.params.chatId));
</script>

<div>
	{#if selectedChat}
		<h1 class="mb-4 text-2xl font-bold">{selectedChat.title}</h1>
		<p>Selected conversation content goes here.</p>
	{:else}
		<p class="text-gray-500">Select a conversation from the sidebar or create a new one.</p>
	{/if}
</div>
