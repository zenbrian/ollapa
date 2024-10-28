<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		addMessage as stAddMessage,
		addChat as stAddChat,
		availableModels as stAvailableModels,
		fetchAvailableModels as stFetchAvailableModels,
		getChatCompletion as stGetChatCompletion
	} from '$lib/stores/chats';

	/** @type {{ selectedChat: App.Chat|null }}*/
	let { selectedChat } = $props();

	/** @type {HTMLDivElement} */
	let chatContainer;

	let selectedModel = $state('');
	let newMessageContent = $state('');
	let isTyping = $state(false);
	let currentResponse = $state('');

	stAvailableModels.subscribe((models) => {
		selectedModel = models[0];
	});

	onMount(async () => {
		if (!selectedChat) {
			await stFetchAvailableModels();
		}

		if (selectedChat && selectedChat.messages.length === 1) {
			// This chat was just created. Get chat completion for first message.

			try {
				isTyping = true;
				currentResponse = '';

				const chatCompletion = await stGetChatCompletion(
					selectedChat.model,
					selectedChat.messages,
					(/** @type {string} **/ partialResponse) => {
						currentResponse = partialResponse;
					}
				);

				await stAddMessage(selectedChat.id, {
					role: 'assistant',
					content: chatCompletion,
					timestamp: new Date()
				});
			} catch (error) {
				console.error('Failed to get chat completion:', error);
				// TODO: show error to user
			} finally {
				isTyping = false;
				currentResponse = '';
			}
		}
	});

	$effect(() => {
		if (chatContainer && (currentResponse || selectedChat?.messages)) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
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
				isTyping = true;
				currentResponse = '';

				const chatCompletion = await stGetChatCompletion(
					selectedChat.model,
					selectedChat.messages,
					(/** @type {string} **/ partialResponse) => {
						currentResponse = partialResponse;
					}
				);

				await stAddMessage(selectedChat.id, {
					role: 'assistant',
					content: chatCompletion,
					timestamp: new Date()
				});
			} catch (error) {
				console.error('Failed to send message:', error);
				// TODO: show error to user
			} finally {
				isTyping = false;
				currentResponse = '';
			}
		}
	}

	async function addChat() {
		if (newMessageContent.trim()) {
			try {
				const chat = await stAddChat(newMessageContent, selectedModel);

				await stAddMessage(chat.id, {
					role: 'user',
					content: newMessageContent,
					timestamp: new Date()
				});

				await goto(`/chat/${chat.id}`);
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
			Using {selectedChat.model}
		{:else}
			<select bind:value={selectedModel}>
				{#each $stAvailableModels as model}
					<option>{model}</option>
				{/each}
			</select>
		{/if}
	</div>

	<div bind:this={chatContainer} class="mb-4 flex-grow overflow-y-auto">
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
			{#if isTyping}
				<div class="mb-2 text-left">
					<span class="inline-block rounded bg-gray-200 p-2">
						<!--- TODO: thinking animation -->
						{currentResponse || 'Thinking...'}
					</span>
				</div>
			{/if}
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
