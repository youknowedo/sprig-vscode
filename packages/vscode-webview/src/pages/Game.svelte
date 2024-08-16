<script lang="ts">
    import { webEngine, type WebEngineAPI } from "sprig/web";
    import { onMount } from "svelte";
    import "../app.css";

    const vscode = acquireVsCodeApi();

    let canvas: HTMLCanvasElement | null = null;
    let game: ReturnType<typeof webEngine> | null = null;
    let isRunning = true;

    let newCode: string | undefined = undefined;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

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
        window.addEventListener("message", (event) => {
            const message = event.data; // The JSON data our extension sent

            switch (message.command) {
                case "update":
                    newCode = message.code;

                    break;
            }
        });

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
    <div class="flex items-center justify-center">
        <img
            class="h-[7.5vh] my-[4vh] object-contain object-center"
            src={"{{LOGO_SRC}}"}
            alt=""
        />
    </div>
    <div
        id="canvas"
        class="{newCode && isRunning
            ? 'show'
            : ''} max-h-[60%] relative object-contain max-w-[80vh] w-[90%] aspect-[160/128] bg-black"
    >
        <canvas
            bind:this={canvas}
            width="160"
            height="128"
            style="image-rendering: pixelated;"
            class="w-full h-full !border-none !outline-none"
            tabindex="0"
        />
    </div>
    <div class="flex items-center flex-1">
        <utton
            class="sprig-button"
            on:click={() => {
                if (game) {
                    if (isRunning) {
                        game.cleanup();
                        timeouts.forEach(clearTimeout);
                        intervals.forEach(clearInterval);

                        if (newCode) {
                            document.getElementsByTagName("code")[0].innerHTML =
                                newCode;
                        }
                    } else if (canvas) {
                        runGame();
                    }
                    isRunning = !isRunning;
                    newCode = undefined;
                }
            }}
        >
            {isRunning ? "Stop" : "Play"}
        </utton>
    </div>
</div>

<style>
    #wrapper:has(*:focus) {
        @apply bg-pcb-green;
    }

    #canvas.show::before {
        content: "New game code available!";
        @apply absolute left-0 right-0 -top-6 text-center text-white bg-pcb-copper h-6 flex items-center justify-center;
    }
</style>
