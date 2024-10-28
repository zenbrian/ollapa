<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		chats,
		isLoading,
		getChats as stGetChats,
		deleteChat as stDeleteChat
	} from '$lib/stores/chats';
	import { goto } from '$app/navigation';

	onMount(() => {
		stGetChats();
	});

	let sortedChats = $derived($chats.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime()))

	/**
	 *
	 * @param {IDBValidKey} id
	 */
	async function handleDeleteChat(id) {
		try {
			await stDeleteChat(id);

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
			<a
				href="/"
				class="mt-2 block w-full rounded bg-blue-500 p-2 text-center text-white hover:bg-blue-600"
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
							? 'bg-gray-200'
							: 'hover:bg-gray-100'}"
					>
						<a class="flex-grow cursor-pointer truncate p-2 text-left" href={`/chat/${chat.id}`}>
							{chat.title}
						</a>

						<button
							onclick={() => handleDeleteChat(chat.id)}
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
