<script>
	// Import store
	import { apiUrl } from '$lib/stores/chats';

	/**
	 * Handles the input event for the Ollama API URL input field.
	 * @param {Event} e - The input event.
	 * @property {HTMLInputElement} e.target - The input element that triggered the event.
	 */
	function handleApiUrlInput(e) {
		apiUrl.set(/** @type {HTMLInputElement} */ (e.target).value);
	}
</script>

<h2 class="mb-4 text-xl font-bold">Settings</h2>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<label for="api-url">Ollama API URL</label>
		<input
			id="api-url"
			class="flex-grow rounded bg-neutral-700 p-2"
			type="text"
			value={$apiUrl}
			oninput={handleApiUrlInput}
		/>
	</div>
</div>
