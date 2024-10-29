<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { XMarkIcon, Cog6ToothIcon } from 'heroicons-svelte/20/solid';
	import { setError } from '$lib/stores/errors.js';
	import {
		chats,
		isLoading,
		getChats as stGetChats,
		deleteChat as stDeleteChat
	} from '$lib/stores/chats';

	onMount(() => {
		try {
			stGetChats();
		} catch (error) {
			console.error('Failed to load chats:', error);
			setError('Failed to load chats.');
		}
	});

	let sortedChats = $derived(
		$chats.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
	);

	/**
	 * Handles the delete chat event. Will navigate the user to home if the currently selected chat
	 * was deleted.
	 *
	 * @param {IDBValidKey} id - The ID of the chat to delete.
	 * @returns {Promise<void>} A promise that resolves when the send operation has completed.
	 */
	async function handleDeleteChat(id) {
		try {
			await stDeleteChat(id);

			if ($page.params.chatId === id) {
				goto(`${base}/`);
			}
		} catch (error) {
			console.error('Failed to delete conversation:', error);
			setError('Failed to delete conversation.');
		}
	}
</script>

<aside class="w-64 bg-neutral-900">
	<div class="p-4">
		<div class="mb-4 flex gap-1">
			<a
				title="Settings"
				href="{base}/settings"
				class="flex w-10 items-center justify-center rounded hover:bg-neutral-800"
			>
				<Cog6ToothIcon class="h-4 w-4" />
			</a>
			<a
				href="{base}/"
				class={`block w-full rounded bg-blue-500 p-2 text-center text-white hover:bg-blue-600 ${$page.route.id === '/' ? 'invisible' : 'visible'}`}
			>
				New chat
			</a>
		</div>

		{#if $isLoading}
			<p>Loading chats...</p>
		{:else}
			<div class="flex flex-col gap-1">
				{#each sortedChats as chat (chat.id)}
					<div
						class="flex rounded {$page.params.chatId === chat.id
							? 'bg-neutral-800'
							: 'hover:bg-neutral-800'}"
					>
						<a class="flex-grow cursor-pointer truncate p-2 text-left" href="{base}/chat/{chat.id}">
							{chat.title}
						</a>

						<button
							onclick={() => handleDeleteChat(chat.id)}
							class="ml-2 flex-none rounded px-2 py-1 text-neutral-500 hover:text-white"
							title="Delete chat"
						>
							<XMarkIcon class="h-4 w-4" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</aside>
