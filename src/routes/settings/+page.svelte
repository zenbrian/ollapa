<script>
	// Import store
	import { apiUrl, enableThinkingMode } from '$lib/stores/chats';

	/**
	 * Handles the input event for the Ollama API URL input field.
	 *
	 * @param {Event} e - The input event.
	 * @property {HTMLInputElement} e.target - The input element that triggered the event.
	 */
	function handleApiUrlInput(e) {
		apiUrl.set(/** @type {HTMLInputElement} */ (e.target).value);
	}

	/**
	 * Handles the change event for the thinking mode toggle.
	 *
	 * @param {Event} e - The change event.ㄎ
	 * @property {HTMLInputElement} e.target - The checkbox element that triggered the event.
	 */
	function handleThinkingModeChange(e) {
		enableThinkingMode.set(/** @type {HTMLInputElement} */ (e.target).checked);
	}
</script>

<div class="mx-auto max-w-2xl py-10">
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

		<div class="flex items-center gap-2">
			<input
				id="thinking-mode"
				type="checkbox"
				checked={$enableThinkingMode}
				onchange={handleThinkingModeChange}
				class="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-blue-600 focus:ring-blue-500"
			/>
			<label for="thinking-mode" class="text-sm">
				Enable LLM Thinking Mode
				<span class="text-xs text-neutral-400 block">
					When enabled, the LLM will show its reasoning process. When disabled, "/no_think" will be added to messages.
				</span>
			</label>
		</div>
	</div>

	<div class="mt-16 text-sm italic text-neutral-500">Settings saved automatically.</div>
</div>
