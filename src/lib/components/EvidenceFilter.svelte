<script lang="ts">
    import type { EvidenceFilterMode } from "$lib/types";

    let {
        filter,
        onChange,
    }: {
        filter: EvidenceFilterMode;
        onChange: (mode: EvidenceFilterMode) => void;
    } = $props();

    function handleClick() {
        if (filter === "all") {
            onChange("with_evidence");
        } else if (filter === "with_evidence") {
            onChange("without_evidence");
        } else {
            onChange("all");
        }
    }
</script>

<button onclick={handleClick} class={filter}>
    <span class="label">Evidence:</span>
    <span class="value">
        {#if filter === "all"}
            All
        {:else if filter === "with_evidence"}
            With
        {:else}
            Without
        {/if}
    </span>
</button>

<style>
    button {
        padding: 0.625rem 1rem;
        text-align: center;
        display: flex;
        gap: 0.5rem;
        transition: all 0.2s;

        &:hover {
            background-color: #f3f4f6;
        }

        &.with_evidence {
            background-color: #ecfdf5;
            border-color: #10b981;
            color: #047857;

            &:hover {
                background-color: #d1fae5;
            }
        }

        &.without_evidence {
            background-color: #fef2f2;
            border-color: #ef4444;
            color: #b91c1c;

            &:hover {
                background-color: #fee2e2;
            }
        }
    }

    .label {
        font-weight: 400;
        color: inherit;
        opacity: 0.8;
    }

    .value {
        font-weight: 600;
    }
</style>
