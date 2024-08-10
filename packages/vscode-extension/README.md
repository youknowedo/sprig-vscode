# SprigKit VSCode Extension

Heavily inspired by the [vs-sprig](https://github.com/hackclub/VS-Sprig), this extension allows you to develop and play your Sprig games without leaving your editor.

## Features

- Play Sprig games inside the editor.
- Automatic loading of new code (restart required for them to be applied).
-   `console.log` output via a custom Output channel.
- Multiple games running in parallel.
- Custom `setTimeout` & `setInterval`. Automatic clearing on game stop.

### Planned features

- Running via the debug menu (when I figure out how the DA API works)
- Fully customizable via Extension Settings
- GUI support for <code>bitmap\`\`</code>, <code>map\`\`</code>, <code>color\`\`</code> & <code>tune\`\`</code> 

## Commands

-   `SprigKit: Open game from workspace`: Opens the game panel and loads the game code from `dist/index.js`.
-   `SprigKit: Open game from file`: Opens the game panel and loads the game code from the currently opened file.

## License

Licensed under the [MIT License](./LICENSE).
