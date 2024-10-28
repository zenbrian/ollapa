<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		addMessage as stAddMessage,
		addChat as stAddChat,
		availableModels as stAvailableModels,
		fetchAvailableModels as stFetchAvailableModels
	} from '$lib/stores/chats';

	/** @type {{ selectedChat: App.Chat|null }}*/
	let { selectedChat } = $props();

	let selectedModel = $state('');
	let newMessageContent = $state('');

	stAvailableModels.subscribe((models) => {
		selectedModel = models[0];
	});

	onMount(async () => {
		if (!selectedChat) {
			await stFetchAvailableModels();
		}
	});

	async function addMessage() {
		if (newMessageContent.trim() && selectedChat) {
			try {
				await stAddMessage(selectedChat.id, {
					role: 'user',
					content: newMessageContent,
					timestamp: new Date()
				});

				newMessageContent = '';

				// TODO: Replace mock with API call and return value
				await stAddMessage(selectedChat.id, {
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
				const chat = await stAddChat(newMessageContent, selectedModel);
				selectedChat = chat;
				goto(`/chat/${chat.id}`);

				addMessage();
			} catch (error) {
				console.error('Failed to create chat:', error);
				// TODO: show error to user
			}
		}
	}

	async function handleSend() {
		if (selectedChat) {
			addMessage();
		} else {
			addChat();
		}
	}
</script>

<div class="mx-auto flex h-full max-w-2xl flex-col">
	<div class="mb-4">
		{#if selectedChat}
			Using model {selectedChat.model}
		{:else}
			<select bind:value={selectedModel}>
				{#each $stAvailableModels as model}
					<option>{model}</option>
				{/each}
			</select>
		{/if}
	</div>

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
			onkeypress={(e) => e.key === 'Enter' && handleSend()}
		/>
		<button onclick={handleSend} class="rounded-r bg-blue-500 p-2 text-white hover:bg-blue-600">
			<!-- TODO: send svg icon -->
			Send
		</button>
	</div>
</div>
