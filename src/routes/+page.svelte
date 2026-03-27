<script lang="ts">
    import {
        Header,
        FilterBar,
        CategorySection,
        EvidenceModal,
        ProgressChart,
    } from "$lib/components";
    import BackToTop from "$lib/components/BackToTop.svelte";
    import { loadAllGoals, filterGoals, evidenceModules } from "$lib/loadGoals";
    import { statuses, tracks } from "$lib/stores/filterProperties.store";
    import type {
        LearningGoal,
        Track,
        Status,
        EvidenceFilterMode,
    } from "$lib/types";
    import type { Component } from "svelte";

    // Eager load - data is available immediately
    const categories = loadAllGoals();

    let selectedTrack = $state<Track[]>([...tracks]);
    let selectedStatus = $state<Status[]>([...statuses]);
    let evidenceFilter = $state<EvidenceFilterMode>("all");
    let searchQuery = $state("");

    let selectedGoal = $state<LearningGoal | null>(null);
    let EvidenceComponent = $state<Component | null>(null);
    let isLoadingEvidence = $state(false);

    let filteredCategories = $derived(
        filterGoals(
            categories,
            selectedTrack,
            selectedStatus,
            searchQuery,
            evidenceFilter,
        ),
    );

    let totalGoals = $derived(
        categories.reduce((sum, cat) => sum + cat.goals.length, 0),
    );

    let filteredGoalsCount = $derived(
        filteredCategories.reduce((sum, cat) => sum + cat.goals.length, 0),
    );

    async function handleViewEvidence(goal: LearningGoal) {
        selectedGoal = goal;
        EvidenceComponent = null;
        isLoadingEvidence = true;

        const modulePath = goal.evidencePath;
        const loader = evidenceModules[modulePath];

        if (loader) {
            try {
                const module = await loader();
                EvidenceComponent = module.default;
            } catch (e) {
                console.error("Failed to load evidence:", e);
            }
        }
        isLoadingEvidence = false;
    }

    function handleCloseModal() {
        selectedGoal = null;
        EvidenceComponent = null;
    }

    function handleTrackChange(tracks: Track[]) {
        selectedTrack = tracks;
    }

    function handleStatusChange(statuses: Status[]) {
        selectedStatus = statuses;
    }

    function handleSearchChange(query: string) {
        searchQuery = query;
    }

    function handleEvidenceFilterChange(mode: EvidenceFilterMode) {
        evidenceFilter = mode;
    }
</script>

<div class="container">
    <Header>
        <div class="progress-chart-container">
            <ProgressChart {categories} />
        </div>
    </Header>
    <div class="sticky-container">
        <FilterBar
            {selectedTrack}
            {selectedStatus}
            {searchQuery}
            {evidenceFilter}
            onTrackChange={handleTrackChange}
            onStatusChange={handleStatusChange}
            onSearchChange={handleSearchChange}
            onEvidenceFilterChange={handleEvidenceFilterChange}
        />

        <table class="goals-table-header">
            <colgroup>
                <col class="col-title" />
                <col class="col-track" />
                <col class="col-status" />
                <col class="col-verified" />
                <col class="col-project" />
                <col class="col-evidence" />
            </colgroup>
            <thead>
                <tr>
                    <th class="text-left"
                        >Learning Goal&nbsp;
                        {#if filteredGoalsCount !== totalGoals}
                            <span class="filter-info">
                                {filteredGoalsCount}/{totalGoals}
                            </span>
                        {/if}</th
                    >
                    <th>Track</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>OPO/Project</th>
                    <th>Evidence</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="table-container">
        {#each filteredCategories as category (category.number)}
            <CategorySection {category} onViewEvidence={handleViewEvidence} />
        {:else}
            <p class="no-results">No learning goals match your filters.</p>
        {/each}
    </div>
</div>

<EvidenceModal
    goal={selectedGoal}
    {EvidenceComponent}
    isLoading={isLoadingEvidence}
    onClose={handleCloseModal}
/>

<BackToTop />

<style>
    .container {
        width: 100%;
        max-width: 100%;
        padding: 0 1rem;
    }

    .progress-chart-container {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        padding: 8px;
    }

    @media (max-width: 1100px) {
        .progress-chart-container {
            position: relative;
            display: flex;
            justify-content: center;
        }
    }

    .sticky-container {
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        backdrop-filter: blur(10px);
        background-color: color-mix(
            in srgb,
            var(--color-primary),
            transparent 70%
        );
        padding-top: 0.5rem;
    }

    @media (max-width: 500px) {
        .sticky-container {
            position: relative;
        }
    }

    .filter-info {
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
        margin: 1rem 0;
    }

    .table-container {
        width: 100%;
        background: white;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgb(0 41 63 / 0.15);
    }

    .goals-table-header {
        width: 100%;
        text-align: left;
        font-size: 0.875rem;
        color: #6b7280;
        table-layout: fixed;
        border-radius: 1rem;
        border-collapse: collapse;

        .col-title {
            width: 40%;
        }

        .col-track,
        .col-status,
        .col-verified,
        .col-project,
        .col-evidence {
            width: 12%;
        }

        thead {
            background: linear-gradient(
                to right,
                var(--color-primary),
                #004165
            );

            tr {
                text-align: center;
            }

            th {
                padding: 1rem 1.5rem;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                color: white;

                &.text-left {
                    text-align: left;
                }
            }
        }
    }

    .no-results {
        text-align: center;
        color: #9ca3af;
        font-style: italic;
        padding: 3rem;
    }
</style>
