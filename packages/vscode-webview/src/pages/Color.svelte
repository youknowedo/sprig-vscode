<script lang="ts">
    import { onMount } from "svelte";

    const vscode = acquireVsCodeApi();

    const COLORS = {
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

    const COLORS_ARRAY: (keyof typeof COLORS)[] = Object.keys(COLORS) as any;

    let selectedColor: keyof typeof COLORS = "#000000";
    let data: {
        startPos: { line: number; character: number };
        endPos: { line: number; character: number };
        currentColor: string;
    };

    onMount(() => {
        const dataEl = document.querySelector("data") as HTMLDataElement;
        data = JSON.parse(dataEl.innerText);

        selectedColor = Object.entries(COLORS).find(
            ([, value]) => value === data.currentColor
        )?.[0] as keyof typeof COLORS;
    });
</script>

<div
    class="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden transition-colors bg-center bg-cover font-pcb bg-pcb-green bg-pcb-overlay"
>
    <div>
        <h1 class="text-4xl font-bold text-white">Color</h1>
        <!-- View colors in a grid that you can choose between -->
        <div class="grid grid-cols-4 gap-4 mt-4">
            {#each COLORS_ARRAY as color}
                <button
                    on:click={() => {
                        selectedColor = color;
                        vscode.postMessage({
                            command: "newValue",
                            value: COLORS[selectedColor],
                        });
                        console.log("sending", COLORS[selectedColor]);
                    }}
                    class="flex items-center justify-center aspect-square h-[10vh] rounded-md shadow-md {color ===
                    selectedColor
                        ? 'outline-4 outline outline-white'
                        : ''}"
                    style={color !== "transparent"
                        ? `background-color: ${color}`
                        : "background-image: url(\"data:image/svg+xml,%0A%3Csvg width='23' height='23' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='white'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0H4V4H0V0ZM4 4H8V8H4V4Z' fill='%23DCEFFC'/%3E%3C/svg%3E%0A\")"}
                ></button>
            {/each}
        </div>
    </div>
</div>
