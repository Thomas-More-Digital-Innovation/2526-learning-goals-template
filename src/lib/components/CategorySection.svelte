<script lang="ts">
    import type { Category, LearningGoal } from "$lib/types";
    import LearningGoalRow from "./LearningGoalRow.svelte";

    interface Props {
        category: Category;
        onViewEvidence: (goal: LearningGoal) => void;
    }

    let { category, onViewEvidence }: Props = $props();
    let isExpanded = $state(true);

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }
</script>

<div class="category-section">
    <button class="category-header" onclick={toggleExpanded}>
        <span class="category-title">
            <span class="category-number">{category.number}.</span>
            {category.name}
            <span class="goal-count">({category.goals.length} goals)</span>
        </span>
        <svg
            class="chevron"
            class:rotated={!isExpanded}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
            />
        </svg>
    </button>

    {#if isExpanded}
        <table class="goals-table">
            <colgroup>
                <col class="col-title" />
                <col class="col-track" />
                <col class="col-status" />
                <col class="col-verified" />
                <col class="col-project" />
                <col class="col-evidence" />
            </colgroup>
            <tbody>
                {#each category.goals as goal (goal.number)}
                    <LearningGoalRow {goal} {onViewEvidence} />
                {/each}
            </tbody>
        </table>
    {/if}
</div>

<style>
    .category-section {
        border-bottom: 1px solid #e5e7eb;
        position: relative;
    }

    .category-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 1rem 1.5rem;
        background: linear-gradient(to right, #f8fafc, #f1f5f9);
        border: none;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
            background: linear-gradient(to right, #f1f5f9, #e2e8f0);
        }
    }

    .category-title {
        font-weight: 700;
        font-size: 1rem;
        color: var(--color-primary);

        .category-number {
            color: var(--color-accent);
        }

        .goal-count {
            font-weight: 400;
            font-size: 0.875rem;
            color: #6b7280;
            margin-left: 0.5rem;
        }
    }

    .chevron {
        width: 1.25rem;
        height: 1.25rem;
        color: #6b7280;
        transition: transform 0.3s ease;

        &.rotated {
            transform: rotate(-180deg);
        }
    }

    .goals-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;

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
    }
</style>
