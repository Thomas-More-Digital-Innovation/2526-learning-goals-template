const learningGoalAssets = import.meta.glob('../../learning_goals/*/*/assets/*', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

const staticContentAssets = import.meta.glob('../../static/content/*/*/assets/*', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

const projectAssets = import.meta.glob('../../learning_goals/projects/assets/*', {
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
    const learningGoalsKey = `../../learning_goals/${categoryNumber}/${goalNumber}/assets/${filename}`;
    const staticContentKey = `../../static/content/${categoryNumber}/${goalNumber}/assets/${filename}`;

    return assets[learningGoalsKey] || assets[staticContentKey] || null;
}

export function resolveProjectAssetPath(filename: string): string | null {
    const projectKey = `../../learning_goals/projects/assets/${filename}`;
    return assets[projectKey] || null;
}
