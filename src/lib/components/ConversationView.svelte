<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import WelcomeScreen from './WelcomeScreen.svelte';
	import { PaperAirplaneIcon } from 'heroicons-svelte/20/solid';
	import ThinkingSpinner from './ThinkingSpinner.svelte';
	import { setError } from '$lib/stores/errors.js';
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
			try {
				await stFetchAvailableModels();
			} catch (error) {
				console.error('Failed to fetch available models:', error);
				setError(
					'Failed to fetch available models. Make sure your Ollama server is configured correctly.'
				);
			}
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
				setError('Failed to get chat completion.');
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

	/**
	 * Parses Markdown into HTML and then sanitizes it.
	 *
	 * @param {string} content - The Markdown content to parse and sanitize.
	 * @returns {string} The sanitized HTML content.
	 */
	function parseMarkdown(content) {
		const rawHtml = String(marked(content));
		return DOMPurify.sanitize(rawHtml);
	}

	/**
	 * Adds a new message to the current chat.
	 *
	 * @async
	 * @returns {Promise<void>} A promise that resolves when the message has been added.
	 */
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
				setError('Failed to send message.');
			} finally {
				isTyping = false;
				currentResponse = '';
			}
		}
	}

	/**
	 * Creates a new chat with the new message content and selected model.
	 *
	 * @async
	 * @returns {Promise<void>} A promise that resolves when the chat has been created.
	 */
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
				setError('Failed to create chat.');
			}
		}
	}

	/**
	 * Handles the send event (either button click event or Enter keypress).
	 *
	 * If a chat is currently selected, adds a new message to the chat.
	 * Otherwise, creates a new chat with the new message content and model.
	 *
	 * @async
	 * @returns {Promise<void>} A promise that resolves when the send operation has completed.
	 */
	async function handleSend() {
		if (selectedChat) {
			addMessage();
		} else {
			addChat();
		}
	}

	/**
	 * Handles the keypress event on the message input textarea. If the Enter key
	 * is pressed without the Shift key, sends the message. Also adjusts the
	 * textarea height to fit the content.
	 *
	 * @param {KeyboardEvent} e - The keypress event.
	 */
	async function handleKeypress(e) {
		/** @type {HTMLTextAreaElement|null} */
		const target = e.target instanceof HTMLTextAreaElement ? e.target : null;

		if (target) {
			if (e.key === 'Enter' && !e.shiftKey) {
				await handleSend();
				target.style.height = 'auto';
			} else {
				target.style.height = 'auto';
				target.style.height = `${target.scrollHeight}px`;
			}
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="mb-4">
		{#if selectedChat}
			<div class="p-2 text-FontSecondary bg-Sidebarbg rounded border border-Border">
				{selectedChat.model}
			</div>
		{:else}
			<select class="rounded bg-white border border-Border p-2 text-Font focus:border-Button focus:outline-none transition-colors" bind:value={selectedModel}>
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
					<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
						<span
							class="prose prose-gray inline-block rounded p-3 shadow-card max-w-none {message.role ===
							'user'
								? 'bg-MessageUser border border-Border'
								: 'bg-MessageAssistant border border-Border'}"
						>
							<!-- parseMarkdown() sanitizes HTML with DOMPurify. Using @html is safe with it -->
							<!-- eslint-disable svelte/no-at-html-tags -->
							{@html parseMarkdown(message.content)}
						</span>
					</div>
				{/each}

				{#if isTyping}
				 <div class="mb-4 text-left">
				 <span class="prose prose-gray inline-block rounded p-3 shadow-card bg-MessageAssistant border border-Border max-w-none">
				 {#if currentResponse}
				 {@html parseMarkdown(currentResponse)}
				 <ThinkingSpinner class="inline h-4 w-4 ml-2 text-Button" />
				 {:else}
				 <span class="text-FontSecondary">Thinking...</span>
				 <ThinkingSpinner class="inline h-4 w-4 ml-2 text-Button" />
				 {/if}
				 </span>
				 </div>
				 {/if}
			</div>
		{:else}
			<WelcomeScreen />
		{/if}
	</div>

	<div class={`mx-auto flex w-full max-w-2xl ${isTyping ? 'opacity-50' : ''}`}>
		<textarea
			bind:value={newMessageContent}
			placeholder="Type your message..."
			rows="1"
			class="flex-grow rounded-l-lg bg-white border border-Border border-r-0 p-3 text-Font placeholder-FontSecondary focus:border-Button focus:outline-none transition-colors resize-none"
			disabled={isTyping}
			onkeypress={(e) => handleKeypress(e)}
		></textarea>
		<button
			onclick={handleSend}
			title="Send"
			class={`rounded-r-lg bg-Button border border-Button p-3 text-white transition-colors ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ButtonHover'}`}
			disabled={isTyping}
		>
			<PaperAirplaneIcon class="h-6 w-6" />
		</button>
	</div>
</div>
