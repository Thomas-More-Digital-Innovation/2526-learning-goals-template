export const assets = import.meta.glob('../content/*/*/assets/*', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

export function resolveAssetPath(categoryNumber: number, goalNumber: string, filename: string): string | null {
    // Expected path format in the glob: ../content/{cat}/{goal}/assets/{filename}
    // We need to match this format exactly
    const key = `../content/${categoryNumber}/${goalNumber}/assets/${filename}`;
    return assets[key] || null;
}
