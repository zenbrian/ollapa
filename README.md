# Ollama Client

Ollama client built with Svelte 5 and SvelteKit.

## Usage

When accessing from the web, you must set the `OLLAMA_ORIGINS` environment
variable so that your local Ollama REST API server accepts connections from the
external domain.

### macOS

Use `launchctl` to set the environment variable.

```sh
launchctl setenv OLLAMA_ORIGINS "https://travishorn.github.io"
```

### Linux

1. Open the service file.

```sh
systemctl edit ollama.service
```

2. Edit the `[Service]` section to set the environment variable.

```
[Service]
Environment="OLLAMA_ORIGINS=https://travishorn.github.io"
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

7. For **Variable value**, enter `https://travishorn.github.io`.

8. Click **OK** on each window to save the settings and close them.

9. Open a _new_ (close out of any already-open) terminal and run `ollama serve`.

## To Do

- Cancel completion
- More complete JSDoc comments
- Complete README & package.json
- Other TODO comments in code
- Splash screen
- Storage meter
- Conditional autoscroll
- Line breaks in input

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
