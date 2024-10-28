<script>
	import { page } from '$app/stores';
	import { chats } from '$lib/stores/chats';
	import ConversationView from '$lib/components/ConversationView.svelte';

	const selectedChat = $derived($chats.find((chat) => chat.id === $page.params.chatId));
</script>

{#if selectedChat}
	<ConversationView {selectedChat} />
{/if}
