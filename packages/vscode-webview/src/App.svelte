<script lang="ts">
    import { webEngine, type WebEngineAPI } from "sprig/web";
    import { onMount } from "svelte";
    import "./app.css";

    const vscode = acquireVsCodeApi();

    let canvas: HTMLCanvasElement | null = null;
    let game: ReturnType<typeof webEngine> | null = null;
    let isRunning = true;

    const timeouts: Timer[] = [];
    const intervals: Timer[] = [];

    const runGame = () => {
        if (!canvas) return;

        game = webEngine(canvas);

        const api: WebEngineAPI & {
            setTimeout: (
                ...args: Parameters<typeof setTimeout>
            ) => ReturnType<typeof setTimeout>;
            setInterval: (
                ...args: Parameters<typeof setInterval>
            ) => ReturnType<typeof setInterval>;
        } = {
            ...game.api,
            setTimeout: (...args: Parameters<typeof setTimeout>) => {
                const timer = setTimeout(...args);
                timeouts.push(timer);
                return timer;
            },
            setInterval: (...args: Parameters<typeof setInterval>) => {
                const timer = setInterval(...args);
                intervals.push(timer);
                return timer;
            },
        };

        const code = document.getElementsByTagName("code")[0].innerText.trim();

        const _addConsoleOutput = (type: "log" | "error", ...args: any[]) => {
            const text = args.join(" ");
            // TODO: Do something with errors
            vscode.postMessage({
                command: "log",
                text: text,
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
                setTimeout,
                setInterval,
            } = arguments[0];
                
            ${code}
        `);
        run(api);

        console.log = log;
        console.error = error;
    };

    onMount(() => {
        while (!canvas);

        runGame();
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    id="wrapper"
    class="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden transition-colors bg-center bg-cover font-pcb bg-pcb-green/80 bg-pcb-overlay"
    on:click={(e) => {
        canvas?.focus();
    }}
>
    <div class="flex items-center justify-center flex-1">
        <img
            class="max-h-32 md:max-h-44 my-8 max-w-[40%] object-contain object-center"
            src={"{{LOGO_SRC}}"}
            alt=""
        />
    </div>
    <canvas
        bind:this={canvas}
        width="160"
        height="128"
        style="image-rendering: pixelated;"
        class="max-h-[60%] object-contain max-w-[100vh] w-[90%] aspect-[160/128] bg-black !border-none !outline-none"
        tabindex="0"
    />
    <div class="flex items-center flex-1">
        <button
            class="box-border px-4 py-2 text-xl font-bold text-black border-4 border-opacity-50 bg-pcb-copper active:border-opacity-50 border-b-black border-r-black border-t-white active:border-l-black active:border-b-white active:border-r-white active:border-t-black border-l-white"
            on:click={() => {
                if (game) {
                    if (isRunning) {
                        game.cleanup();
                        timeouts.forEach(clearTimeout);
                        intervals.forEach(clearInterval);
                    } else if (canvas) {
                        runGame();
                    }
                    isRunning = !isRunning;
                }
            }}
        >
            {isRunning ? "Stop" : "Play"}
        </button>
    </div>
</div>

<style>
    #wrapper:has(*:focus) {
        @apply bg-pcb-green;
    }
</style>
