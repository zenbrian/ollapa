<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { chats, isLoading, loadChats, createChat, removeChat } from '$lib/stores/chats';
	import { goto } from '$app/navigation';

	let newChatTitle = '';

	onMount(() => {
		loadChats();
	});

	async function handleCreateChat() {
		if (newChatTitle.trim()) {
			try {
				await createChat(newChatTitle);
				newChatTitle = '';
			} catch (error) {
				console.error('Failed to create chat:', error);
				// TODO: show error to user
			}
		}
	}

	/**
	 *
	 * @param {IDBValidKey} id
	 */
	async function handleDeleteChat(id) {
		try {
			await removeChat(id);

			if ($page.params.chatId === id) {
				goto('/');
			}
		} catch (error) {
			console.error('Failed to delete conversation:', error);
			// TODO: show error to user
		}
	}
</script>

<aside class="w-64 border-r bg-white">
	<div class="p-4">
		<div class="mb-4">
			<input
				type="text"
				bind:value={newChatTitle}
				placeholder="New chat"
				class="w-full rounded border p-2"
			/>
			<button
				on:click={handleCreateChat}
				class="mt-2 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
			>
				Create
			</button>
		</div>
		{#if $isLoading}
			<p>Loading chats...</p>
		{:else if $chats.length === 0}
			<p>No chats yet. Create one to get started!</p>
		{:else}
			<div class="flex flex-col gap-1">
				{#each $chats as chat (chat.id)}
					<div
						class="flex rounded {$page.params.chatId === chat.id
							? 'bg-gray-200'
							: 'hover:bg-gray-100'}"
					>
						<a class="flex-grow cursor-pointer p-2 text-left" href={`/chat/${chat.id}`}>
							{chat.title}
						</a>

						<button
							on:click={() => handleDeleteChat(chat.id)}
							class="ml-2 flex-none rounded px-2 py-1 text-gray-400 hover:text-black"
							title="Delete chat"
						>
							<!-- TODO: Proper X SVG icon -->
							&times;
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</aside>
