<script lang="ts">
	import { errorStore, clearError } from '$lib/stores/errors.js';
	import { XMarkIcon } from 'heroicons-svelte/20/solid';
	import { fade } from 'svelte/transition';
</script>

{#if $errorStore}
	<div
		role="alert"
		aria-live="assertive"
		class="fixed right-4 top-4 z-50 max-w-md"
		transition:fade={{ duration: 200 }}
	>
		<div class="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 shadow-lg">
			<p>{$errorStore}</p>
			<button
				onclick={clearError}
				class="ml-4 rounded text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors"
				aria-label="Dismiss error message"
			>
				<XMarkIcon class="h-5 w-5" />
			</button>
		</div>
	</div>
{/if}
