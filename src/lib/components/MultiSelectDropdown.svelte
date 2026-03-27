<script lang="ts">
    import { onMount } from "svelte";

    interface Props {
        label: string;
        options: string[];
        selected: string[];
        onChange: (selected: string[]) => void;
    }

    let { label, options, selected, onChange }: Props = $props();

    let isOpen = $state(false);
    let dropdownRef: HTMLDivElement;

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function closeDropdown(e: MouseEvent) {
        if (dropdownRef && !dropdownRef.contains(e.target as Node)) {
            isOpen = false;
        }
    }

    function toggleOption(option: string) {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    }

    function toggleAll() {
        if (selected.length === options.length) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    }

    onMount(() => {
        document.addEventListener("click", closeDropdown);
        return () => {
            document.removeEventListener("click", closeDropdown);
        };
    });

    let displayValue = $derived(
        selected.length === 0
            ? "None"
            : selected.length === options.length
              ? "All"
              : `${selected.length} selected`,
    );
</script>

<div class="dropdown-container" bind:this={dropdownRef}>
    <button onclick={toggleDropdown} class="dropdown-trigger">
        <label class="dropdown-label" for={`dropdown-${label}`}>{label}:</label>
        <span class="value-text">{displayValue}</span>
        <svg
            class="chevron {isOpen ? 'open' : ''}"
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

    {#if isOpen}
        <div class="dropdown-menu">
            <div class="dropdown-header">
                <button class="select-all-btn" onclick={toggleAll}>
                    {selected.length === options.length
                        ? "Deselect All"
                        : "Select All"}
                </button>
            </div>
            <div class="dropdown-list">
                {#each options as option}
                    <label class="checkbox-item">
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onchange={() => toggleOption(option)}
                        />
                        <span class="checkbox-label">{option}</span>
                    </label>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .dropdown-container {
        position: relative;
        display: inline-flex;
        align-items: center;
    }

    .dropdown-label {
        font-weight: 600;
        cursor: pointer;
    }

    .dropdown-trigger {
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        display: flex;
        align-items: center;
        height: 100%;
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
    }

    .chevron {
        width: 1.25rem;
        height: 1.25rem;
        transition: transform 0.2s;
    }

    .chevron.open {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        width: 200px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 200;
        overflow: hidden;
    }

    .dropdown-header {
        padding: 0.5rem;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
    }

    .select-all-btn {
        width: 100%;
        padding: 0.25rem;
        font-size: 0.75rem;
        color: var(--color-primary);
        background: transparent;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    .select-all-btn:hover {
        background: #e5e7eb;
    }

    .dropdown-list {
        max-height: 200px;
        overflow-y: auto;
        padding: 0.5rem 0;
    }

    .checkbox-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.75rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .checkbox-item:hover {
        background-color: #f3f4f6;
    }

    .checkbox-item input[type="checkbox"] {
        accent-color: var(--color-primary);
    }

    .checkbox-label {
        font-size: 0.875rem;
        color: #374151;
    }
</style>
