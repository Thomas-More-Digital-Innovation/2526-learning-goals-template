const learningGoalAssets = import.meta.glob('../../learning_goals/*/*/assets/**/*', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

const staticContentAssets = import.meta.glob('../../static/content/*/*/assets/**/*', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

const projectAssets = import.meta.glob('../../learning_goals/projects/assets/**/*', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

export const assets: Record<string, string> = {
    ...learningGoalAssets,
    ...staticContentAssets,
    ...projectAssets,
};

export function resolveAssetPath(categoryNumber: number, goalNumber: string, filename: string): string | null {
    // Normalize common relative formats used in evidence files.
    const normalizedFilename = filename
        .replace(/^[./\\]+/, '')
        .replace(/^assets[\\/]+/, '')
        .replace(/\\/g, '/');

    const learningGoalsKey = `../../learning_goals/${categoryNumber}/${goalNumber}/assets/${normalizedFilename}`;
    const staticContentKey = `../../static/content/${categoryNumber}/${goalNumber}/assets/${normalizedFilename}`;

    return assets[learningGoalsKey] || assets[staticContentKey] || null;
}

export function resolveProjectAssetPath(filename: string): string | null {
    // Normalize common relative formats.
    const normalizedFilename = filename
        .replace(/^[./\\]+/, '')
        .replace(/^assets[\\/]+/, '')
        .replace(/\\/g, '/');

    const projectKey = `../../learning_goals/projects/assets/${normalizedFilename}`;
    return assets[projectKey] || null;
}

export function resolveAsset(
    src: string,
    projectContext?: { projectName: string } | null,
    context?: { categoryNumber: number; goalNumber: string } | null,
): string {
    // If it's an external URL, data URI, or absolute path, return as is
    if (src.startsWith("/") || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(src)) {
        return src;
    }

    // Try project context first
    if (projectContext) {
        const resolved = resolveProjectAssetPath(src);
        if (resolved) return resolved;
    }

    // Fallback to evidence context
    if (context) {
        const resolved = resolveAssetPath(
            context.categoryNumber,
            context.goalNumber,
            src,
        );
        if (resolved) return resolved;
    }

    console.warn(`Could not resolve asset: ${src}`);
    return src;
}
