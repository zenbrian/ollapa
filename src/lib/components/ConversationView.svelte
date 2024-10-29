<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { PaperAirplaneIcon } from 'heroicons-svelte/20/solid';
	import ThinkingSpinner from './ThinkingSpinner.svelte';
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
		if (chatContainer && (isTyping || currentResponse || selectedChat?.messages)) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});

	/**
	 *
	 * @param {string} content
	 */
	function parseMarkdown(content) {
		const rawHtml = String(marked(content));
		return DOMPurify.sanitize(rawHtml);
	}

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

				await goto(`${base}/chat/${chat.id}`);
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

<div class="flex h-full flex-col">
	<div class="mb-4">
		{#if selectedChat}
			<div class="p-2 text-neutral-500">
				{selectedChat.model}
			</div>
		{:else}
			<select class="rounded bg-neutral-700 p-2" bind:value={selectedModel}>
				{#each $stAvailableModels as model}
					<option>{model}</option>
				{/each}
			</select>
		{/if}
	</div>

	<div bind:this={chatContainer} class="mb-4 flex-grow overflow-y-auto">
		{#if selectedChat}
			<div class="mx-auto max-w-2xl">
				{#each selectedChat.messages as message}
					<div class="mb-2 {message.role === 'user' ? 'text-right' : 'text-left'}">
						<span
							class="prose prose-neutral prose-invert inline-block rounded p-2 {message.role ===
							'user'
								? 'bg-neutral-700'
								: ''}"
						>
							<!-- parseMarkdown() santizes HTML with DOMPurify. Using @html is safe with it -->
							<!-- eslint-disable svelte/no-at-html-tags -->
							{@html parseMarkdown(message.content)}
						</span>
					</div>
				{/each}

				{#if isTyping}
					<div class="mb-2 text-left">
						<span class="prose prose-neutral prose-invert inline-block p-2">
							{#if currentResponse}
								{@html parseMarkdown(currentResponse)}
								<ThinkingSpinner class="inline h-4 w-4" />
							{:else}
								Thinking
								<ThinkingSpinner class="inline h-4 w-4" />
							{/if}
						</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="mx-auto flex w-full max-w-2xl">
		<input
			type="text"
			bind:value={newMessageContent}
			placeholder="Type your message..."
			class="flex-grow rounded-l bg-neutral-700 p-2 outline-none"
			onkeypress={(e) => e.key === 'Enter' && handleSend()}
		/>
		<button
			onclick={handleSend}
			title="Send"
			class="rounded-r bg-blue-500 p-2 text-white hover:bg-blue-600"
		>
			<PaperAirplaneIcon class="h-6 w-6" />
		</button>
	</div>
</div>
