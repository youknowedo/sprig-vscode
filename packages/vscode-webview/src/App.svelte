<script lang="ts">
    import { webEngine, type WebEngineAPI } from "sprig/web";
    import { onMount } from "svelte";
    import "./app.css";

    let canvas: HTMLCanvasElement | null = null;

    const runGame = (api: WebEngineAPI) => {
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
        } = api;
        const code = document.getElementsByTagName("code")[0].innerText.trim();

        console.log(code);

        if (canvas) {
            // src/other.ts
            var otherFunc = () => {
                console.log("Hello from other!");
            };

            // src/index.ts
            var player = "p";
            setLegend([
                player,
                bitmap`
................
................
.......000......
.......0.0......
......0..0......
......0...0.0...
....0003.30.0...
....0.0...000...
....0.05550.....
......0...0.....
.....0....0.....
.....0...0......
......000.......
......0.0.......
.....00.00......
................`,
            ]);
            setSolids([]);
            var level = 0;
            var levels = [
                map`
p.
..`,
            ];
            if (levels[level]) setMap(levels[level]);
            setPushables({
                [player]: [],
            });
            onInput("s", () => {
                const thing = "yurr";
                console.log(thing);
                const p = getFirst(player);
                if (p) p.y += 1;
            });
            afterInput(() => {});
            console.log("Hello from index!");
            otherFunc();
        }
    };

    onMount(() => {
        while (!canvas);

        const game = webEngine(canvas);
        console.log(game);

        runGame(game.api);
    });
</script>

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
