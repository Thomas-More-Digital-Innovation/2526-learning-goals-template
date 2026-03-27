<script lang="ts">
    interface Props {
        src: string;
        title?: string;
        height?: string;
    }

    let { src, title = "PDF Document", height = "600px" }: Props = $props();

    import { getContext } from "svelte";
    import { resolveAssetPath } from "$lib/assets";
    import { base } from "$app/paths";

    const context = getContext("evidence") as
        | { categoryNumber: number; goalNumber: string }
        | undefined;

    let resolvedSrc = $derived.by(() => {
        // If it's an external URL, return as is
        if (src.startsWith('http://') || src.startsWith('https://')) return src;

        let path = src;
        
        // If src doesn't contain slashes and we have context, try auto-resolution
        if (context && !src.includes("/") && !src.includes("\\")) {
            const resolved = resolveAssetPath(
                context.categoryNumber,
                context.goalNumber,
                src,
            );
            if (resolved) {
                path = resolved;
            } else {
                console.warn(
                    `Could not resolve asset: ${src} for goal ${context.goalNumber}`,
                );
            }
        }

        // Ensure path starts with base if it's an internal absolute-style path
        if (path.startsWith("/")) {
            // Avoid double base if it already starts with it
            if (base && path.startsWith(base)) return path;
            return `${base}${path}`;
        }

        // For relative paths like '../content/...', Vite should ideally handle them,
        // but if we are in production and base is set, we might need to be careful.
        // Usually, glob-imported assets are already relative to the root or absolute.
        return path;
    });
</script>

<figure class="evidence-pdf">
    <div class="pdf-header">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            ></path>
            <polyline points="14,2 14,8 20,8"></polyline>
        </svg>
        <span>{title}</span>
        <a
            href={resolvedSrc}
            target="_blank"
            rel="noopener noreferrer"
            class="download-link"
        >
            Open in new tab ↗
        </a>
    </div>
    <iframe src={resolvedSrc} {title} style="height: {height}"></iframe>
</figure>

<style>
    .evidence-pdf {
        margin: 1.5rem 0;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        overflow: hidden;

        .pdf-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 500;
            color: #374151;

            svg {
                color: #ef4444;
            }

            .download-link {
                margin-left: auto;
                font-size: 0.875rem;
                color: #3b82f6;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        iframe {
            width: 100%;
            border: none;
        }
    }
</style>
