<script lang="ts">
    import type { Track, Status, EvidenceFilterMode } from "$lib/types";
    import { MultiSelectDropdown } from "$lib/components";
    import { statuses, tracks } from "$lib/stores/filterProperties.store";
    import EvidenceFilter from "./EvidenceFilter.svelte";

    interface Props {
        selectedTrack: Track[];
        selectedStatus: Status[];
        searchQuery: string;
        evidenceFilter: EvidenceFilterMode;
        onTrackChange: (tracks: Track[]) => void;
        onStatusChange: (statuses: Status[]) => void;
        onSearchChange: (query: string) => void;
        onEvidenceFilterChange: (mode: EvidenceFilterMode) => void;
    }

    let {
        selectedTrack,
        selectedStatus,
        searchQuery,
        evidenceFilter,
        onTrackChange,
        onStatusChange,
        onSearchChange,
        onEvidenceFilterChange,
    }: Props = $props();
</script>

<div class="filter-bar">
    <div class="filter-control">
        <MultiSelectDropdown
            label="Track"
            options={tracks}
            selected={selectedTrack}
            onChange={(selected) => onTrackChange(selected as Track[])}
        />
    </div>

    <div class="filter-control">
        <MultiSelectDropdown
            label="Status"
            options={statuses}
            selected={selectedStatus}
            onChange={(selected) => onStatusChange(selected as Status[])}
        />
    </div>

    <div class="filter-control">
        <EvidenceFilter
            filter={evidenceFilter}
            onChange={onEvidenceFilterChange}
        />
    </div>

    <div class="filter-control searchbar">
        <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
            />
        </svg>
        <input
            type="text"
            placeholder="Search for learning goals"
            value={searchQuery}
            oninput={(e) => onSearchChange(e.currentTarget.value)}
        />
    </div>
    <button
        class="filter-control"
        id="reset-button"
        onclick={() => {
            onTrackChange(tracks);
            onStatusChange(statuses);
            onSearchChange("");
            onEvidenceFilterChange("all");
        }}
    >
        Reset
    </button>
</div>

<style>
    .filter-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .filter-control {
        display: inline-flex;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        color: var(--color-primary);
        transition: all 0.3s;

        &:hover {
            border-color: var(--color-accent);
            box-shadow: 0 4px 6px -1px rgb(250 100 50 / 0.2);
        }

        &:focus {
            outline: none;
            border-color: var(--color-accent);
        }
    }

    .searchbar {
        position: relative;
        display: flex;
        align-items: center;

        .search-icon {
            position: absolute;
            left: 0.75rem;
            width: 1.25rem;
            height: 1.25rem;
            color: var(--color-accent);
            pointer-events: none;
        }

        input {
            padding: 0.625rem 1rem 0.625rem 2.5rem;
            width: 20rem;

            &::placeholder {
                color: #9ca3af;
            }
        }
    }

    #reset-button {
        padding: 0.625rem 1rem;
        text-align: center;
    }
</style>
