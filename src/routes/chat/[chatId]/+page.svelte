<script>
	import { page } from '$app/stores';
	import { addMessageToChat, chats } from '$lib/stores/chats';

	const selectedChat = $derived($chats.find((chat) => chat.id === $page.params.chatId));

	let newMessageContent = $state('');

	async function handleSendMessage() {
		if (newMessageContent.trim() && $page.params.chatId) {
			try {
				await addMessageToChat($page.params.chatId, {
					role: 'user',
					content: newMessageContent,
					timestamp: new Date()
				});

				newMessageContent = '';

				// TODO: Replace mock with API call and return value
				await addMessageToChat($page.params.chatId, {
					role: 'assistant',
					content: 'This is a mock response from the AI assistant.',
					timestamp: new Date()
				});
			} catch (error) {
				console.error('Failed to send message:', error);
				// TODO: show error to user
			}
		}
	}
</script>

{#if selectedChat}
	<div class="flex h-full flex-col">
		<div class="mb-4 flex-grow overflow-y-auto">
			{#each selectedChat.messages as message}
				<div class="mb-2 {message.role === 'user' ? 'text-right' : 'text-left'}">
					<span
						class="inline-block rounded p-2 {message.role === 'user'
							? 'bg-blue-500 text-white'
							: 'bg-gray-200'}"
					>
						{message.content}
					</span>
					<br />
					<small class="text-gray-500">{new Date(message.timestamp).toLocaleString()}</small>
				</div>
			{/each}
		</div>

		<div class="flex">
			<input
				type="text"
				bind:value={newMessageContent}
				placeholder="Type your message..."
				class="flex-grow rounded-l border p-2"
				onkeypress={(e) => e.key === 'Enter' && handleSendMessage()}
			/>
			<button
				onclick={handleSendMessage}
				class="rounded-r bg-blue-500 p-2 text-white hover:bg-blue-600"
			>
				Send
			</button>
		</div>
	</div>
{/if}
