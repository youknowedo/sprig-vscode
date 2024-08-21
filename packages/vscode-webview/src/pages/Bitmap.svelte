<script lang="ts">
    import { onMount } from "svelte";

    const vscode = acquireVsCodeApi();

    const BITMAPS = {
        "#000000": "0",
        "#495057": "L",
        "#91979c": "1",
        "#ffffff": "2",
        "#eb2c47": "3",
        "#8b412e": "C",
        "#19b1f8": "7",
        "#1315e0": "5",
        "#fee610": "6",
        "#958c32": "F",
        "#2de13e": "4",
        "#1d9410": "D",
        "#f56dbb": "8",
        "#aa3ac5": "H",
        "#f57117": "9",
        transparent: ".",
    } as const;

    let data: {
        startPos: { line: number; character: number };
        endPos: { line: number; character: number };
        currentBitmap: string;
    };

    onMount(() => {
        const dataEl = document.querySelector("data") as HTMLDataElement;
        data = JSON.parse(dataEl.innerText);
    });
</script>

<div
    class="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden transition-colors bg-center bg-cover font-pcb bg-pcb-green bg-pcb-overlay"
>
    <div>
        <h1 class="text-4xl font-bold text-white">Bitmap</h1>

        <button class="sprig-button"> Save </button>
    </div>
</div>
