<script lang="ts">
    import Color from "./pages/Color.svelte";
    import Game from "./pages/Game.svelte";

    const pageId = (
        document.getElementsByTagName("id")[0] as HTMLElement
    )?.innerHTML.trim();
</script>

{#if pageId === "color"}
    <Color />
{:else if pageId === "color"}
    <Color />
{:else}
    <Game />
{/if}
