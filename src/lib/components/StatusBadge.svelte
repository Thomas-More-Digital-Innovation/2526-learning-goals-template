<script lang="ts">
    import type { Status } from "$lib/types";

    interface Props {
        status: Status;
    }

    let { status }: Props = $props();

    const statusConfig: Record<
        Status,
        { bg: string; text: string; label: string }
    > = {
        "": { bg: "bg-slate-100", text: "text-slate-400", label: "-" },
        Todo: { bg: "bg-gray-200", text: "text-gray-700", label: "Todo" },
        "In Progress": {
            bg: "bg-amber-200",
            text: "text-amber-800",
            label: "In Progress",
        },
        Done: { bg: "bg-emerald-200", text: "text-emerald-800", label: "Done" },
        Verified: {
            bg: "bg-blue-200",
            text: "text-blue-800",
            label: "Verified",
        },
    };

    let config = $derived(statusConfig[status] || statusConfig[""]);
</script>

{#if status}
    <span class="status-badge {config.bg} {config.text}">
        {config.label}
    </span>
{:else}
    <span class="no-status">-</span>
{/if}

<style>
    .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .no-status {
        color: #d1d5db;
    }
</style>
