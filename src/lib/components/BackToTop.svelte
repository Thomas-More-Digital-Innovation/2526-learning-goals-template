<script lang="ts">
    import { onMount } from "svelte";

    let isVisible = $state(false);

    const visibleThreshold = 24;

    onMount(() => {
        window.addEventListener("scroll", () => {
            isVisible = window.scrollY > visibleThreshold;
        });
    });
</script>

<button
    class="back-to-top"
    hidden={!isVisible}
    onclick={() => window.scrollTo(0, 0)}>&#8593;</button
>

<style>
    .back-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 0.5rem;
        background-color: var(--color-primary);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        z-index: 100;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        font-size: 32px;
    }

    .back-to-top:hover {
        background-color: var(--color-accent);
    }

    .back-to-top[hidden] {
        display: none;
    }
</style>
