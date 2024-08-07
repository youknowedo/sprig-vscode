<script lang="ts">
    import { webEngine } from "sprig/web";
    import { onMount } from "svelte";
    import "./app.css";

    let canvas: HTMLCanvasElement | null = null;

    const code = "{{GAME_CODE}}";

    onMount(() => {
        while (!canvas);

        const game = webEngine(canvas);
        const fn = new Function(...Object.keys(game.api), code);
        fn(...Object.values(game.api));
    });
</script>

<div class="h-screen w-screen bg-black">
    <canvas bind:this={canvas} class="w-screen h-screen" />
</div>
