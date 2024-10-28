<script>
	import { goto } from '$app/navigation';
	import { addMessageToChat, createChat } from '$lib/stores/chats';

	/** @type {{ selectedChat: App.Chat|null }}*/
	let { selectedChat } = $props();

	let newMessageContent = $state('');

	async function addMessage() {
		if (newMessageContent.trim() && selectedChat) {
			try {
				await addMessageToChat(selectedChat.id, {
					role: 'user',
					content: newMessageContent,
					timestamp: new Date()
				});

				newMessageContent = '';

				// TODO: Replace mock with API call and return value
				await addMessageToChat(selectedChat.id, {
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

	async function addChat() {
		if (newMessageContent.trim()) {
			try {
				const chat = await createChat(newMessageContent);
				selectedChat = chat;
				goto(`/chat/${chat.id}`);

				addMessage();
			} catch (error) {
				console.error('Failed to create chat:', error);
				// TODO: show error to user
			}
		}
	}

	async function handleSendMessage() {
		if (selectedChat) {
			addMessage();
		} else {
			addChat();
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="mb-4 flex-grow overflow-y-auto">
		{#if selectedChat}
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
		{/if}
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
