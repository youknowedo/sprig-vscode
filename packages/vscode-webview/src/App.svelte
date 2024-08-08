<script lang="ts">
    import { red } from "picocolors";
    import { webEngine, type WebEngineAPI } from "sprig/web";
    import { onMount } from "svelte";
    import "./app.css";

    let canvas: HTMLCanvasElement | null = null;

    const runGame = (api: WebEngineAPI) => {
        const vscode = acquireVsCodeApi();

        const code = document.getElementsByTagName("code")[0].innerText.trim();

        const _addConsoleOutput = (type: "log" | "error", ...args: any[]) => {
            const text = args.join(" ");
            vscode.postMessage({
                command: "log",
                text: type == "error" ? red(text) : text,
            });
        };

        const log = console.log;
        const error = console.error;

        console.log = (...args) => _addConsoleOutput("log", ...args);
        console.error = (...args) => _addConsoleOutput("error", ...args);

        const run = new Function(`
            const {
                map,
                bitmap,
                color,
                tune,
                setMap,
                addText,
                clearText,
                addSprite,
                getGrid,
                getTile,
                tilesWith,
                clearTile,
                setSolids,
                setPushables,
                setBackground,
                getFirst,
                getAll,
                width,
                height,
                setLegend,
                onInput,
                afterInput,
                playTune,
                getState,
            } = arguments[0];
        
            ${code}
        `);
        run(api);

        console.log = log;
        console.error = error;
    };

    onMount(() => {
        while (!canvas);

        const game = webEngine(canvas);
        console.log(game);

        runGame(game.api);
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="flex items-center justify-center w-screen h-screen duration-500"
    on:click={(e) => {
        canvas?.focus();
    }}
>
    <canvas
        bind:this={canvas}
        width="160"
        height="128"
        style="image-rendering: pixelated;"
        class="max-h-screen object-contain w-full aspect-[160/128] bg-black !border-none !outline-none"
        tabindex="0"
    />
</div>

<style>
    div:has(canvas:focus) {
        @apply bg-black;
    }
</style>
