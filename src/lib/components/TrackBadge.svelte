<script lang="ts">
    import type { Track } from "$lib/types";

    interface Props {
        tracks: Track[];
    }

    let { tracks }: Props = $props();

    const trackColors: Record<Track, string> = {
        APP: "bg-blue-100 text-blue-800",
        AI: "bg-purple-100 text-purple-800",
        CCS: "bg-orange-100 text-orange-800",
        DI: "bg-teal-100 text-teal-800",
        EVERYTHING: "bg-gray-100 text-gray-800",
    };
</script>

<div class="track-badges">
    {#each tracks as track}
        <span
            class="track-badge {trackColors[track] ||
                'bg-gray-100 text-gray-800'}"
        >
            {track}
        </span>
    {/each}
</div>

<style>
    .track-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        justify-content: center;
    }

    .track-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
    }
</style>
