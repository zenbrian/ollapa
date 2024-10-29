<script>
	import llamaHead from '$lib/assets/llama-head.webp';
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-10">
	<img class="h-32 w-32" alt="The Ollapa logo; the head of a llama" src={llamaHead} />

	<h1 class="text-4xl font-bold">Welcome!</h1>

	<div>
		<ul class="mx-auto flex max-w-md list-disc flex-col gap-8">
			<li>
				Make sure Ollama server is running locally and that you have <a
					class="underline"
					href="https://github.com/travishorn/ollapa?tab=readme-ov-file#configure-the-domain-as-a-valid-origin"
					>configured this domain as a valid origin</a
				>.
			</li>
			<li>Choose a model from your locally installed models in the dropdown menu above.</li>
			<li>Type and send a message below.</li>
		</ul>
	</div>
</div>
