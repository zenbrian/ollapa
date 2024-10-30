<p align="center">
  <img alt="The Ollapa logo; Stylized black-and-white line drawing of a llama's head with bold outlines and simple shading." src="src/lib/assets/ollapa-logo.webp" style="width:128px;height:128px" />
</p>

# Ollapa

An Ollama client built with Svelte 5 and SvelteKit. Chat completely local and
client-side with a friendly interface!

Visit [ollapa.chat](https://ollapa.chat)

> [!IMPORTANT]
> You can interact with the chat client directly at the URL above, but you must
> first configure your locally-running Ollama server. See below.

## Configure Your Ollama Server

First, [you must have Ollama installed](https://ollama.com/).

Then, you must have at least one model installed. Example:

```sh
ollama pull llama3.2
```

Finally, if you are accessing Ollapa client from the web at https://ollapa.chat,
you must set the `OLLAMA_ORIGINS` environment variable on your local machine so
that your locally running Ollama REST API server accepts connections from the
external domain https://ollapa.chat. Instructions for macOS, Linux, and Windows
are as follows:

### macOS

Use `launchctl` to set the environment variable.

```sh
launchctl setenv OLLAMA_ORIGINS "https://ollapa.chat"
```

### Linux

1. Open the service file.

```sh
systemctl edit ollama.service
```

2. Edit the `[Service]` section to set the environment variable.

```
[Service]
Environment="OLLAMA_ORIGINS=https://ollapa.chat"
```

3. Restart the service.

```sh
systemctl daemon-reload
systemctl restart-ollama
```

### Windows

1. Quit Ollama from the taskbar.

2. Press **Start** and type `environment variables`.

3. Click **Edit the environment variables**.

4. Click **Environment Variables...**.

5. Under **System variables**, click **New...**.

6. For **Variable name**, enter `OLLAMA_ORIGINS`.

7. For **Variable value**, enter `https://ollapa.chat`.

8. Click **OK** on each window to save the settings and close them.

9. Open a _new_ (close out of any already-open) terminal and run `ollama serve`.

## Local Server

You don't have to use [ollapa.chat](https://ollapa.chat). You can run this client locally if you wish.

Make sure [Node.js](https://nodejs.org) and [git](https://git-scm.com/) are installed.

Clone this repository.

```sh
git clone https://github.com/travishorn/ollapa
```

Change into the directory.

```sh
cd ollapa
```

Install the dependencies.

```sh
npm install
```

Run the development server.

```sh
npm run dev
```

Visit http://localhost:5173 to access the client in your web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

If you modify the code, kindly...

- `npm run format` to ensure consistency across the codebase.
- `npm run lint` to ensure there are no linting errors.

## Roadmap

- Feature: cancel completion
- Feature: storage meter
- Feature: connected to Ollama API status
- Fix: autoscroll only when already at chat bottom

## License

The MIT License (MIT)

Copyright © 2024 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
