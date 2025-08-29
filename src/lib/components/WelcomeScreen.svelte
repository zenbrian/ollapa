<script>
	import logo from '$lib/assets/ollapa-logo.webp';
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-10">
	<img
		class="h-32 w-32 shadow-soft rounded-lg"
		alt="The Ollapa logo; Stylized black-and-white line drawing of a llama's head with bold outlines and simple shading."
		src={logo}
	/>

	<h1 class="text-4xl font-bold text-Font">Welcome!</h1>

	<div>
		<ul class="mx-auto flex max-w-md list-disc flex-col gap-8 text-Font">
			<li>
				Make sure your Ollama server is
				<a
					class="text-Button underline hover:text-ButtonHover transition-colors"
					href="https://github.com/travishorn/ollapa?tab=readme-ov-file#configure-your-ollama-server"
					>configured correctly</a
				>.
			</li>
			<li>Choose a model from your locally installed models in the dropdown menu above.</li>
			<li>Type and send a message below.</li>
		</ul>
	</div>
</div>
