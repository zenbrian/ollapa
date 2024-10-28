<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { XMarkIcon } from 'heroicons-svelte/20/solid';
	import {
		chats,
		isLoading,
		getChats as stGetChats,
		deleteChat as stDeleteChat
	} from '$lib/stores/chats';

	onMount(() => {
		stGetChats();
	});

	let sortedChats = $derived(
		$chats.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
	);

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

<aside class="w-64 bg-neutral-900">
	<div class="p-4">
		<div class={`mb-4 ${$page.route.id === '/' ? 'invisible' : 'visible'}`}>
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
							? 'bg-neutral-800'
							: 'hover:bg-neutral-800'}"
					>
						<a class="flex-grow cursor-pointer truncate p-2 text-left" href={`/chat/${chat.id}`}>
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
