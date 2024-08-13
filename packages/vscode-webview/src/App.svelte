<script lang="ts">
    import Color from "./pages/Color.svelte";
    import Game from "./pages/Game.svelte";

    const pageId: string = "{{PAGE_ID}}";
</script>

{#if pageId === "color"}
    <Color />
{:else}
    <Game />
{/if}
