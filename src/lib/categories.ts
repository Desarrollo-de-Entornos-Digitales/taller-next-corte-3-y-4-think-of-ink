export const CATEGORIES = [
    'Blackwork', 'Realismo', 'Fine Line', 'Tradicional',
    'Neo Tradicional', 'Minimalista', 'Geométrico', 'Anime',
    'Lettering', 'Color', 'Tribal', 'Piercing', 'Estudios',
];

export function normalizeCategory(rawCategory: any): { name: string } | undefined {
    if (typeof rawCategory === 'string') {
        try {
            const parsed = JSON.parse(rawCategory);
            if (parsed && typeof parsed === 'object' && parsed.name) {
                return { name: String(parsed.name) };
            }
        } catch {}
        return { name: rawCategory };
    }
    if (rawCategory && typeof rawCategory === 'object' && 'name' in rawCategory) {
        const name = rawCategory.name;
        if (typeof name === 'string') {
            try {
                const parsed = JSON.parse(name);
                if (parsed && typeof parsed === 'object' && parsed.name) {
                    return { name: String(parsed.name) };
                }
            } catch {}
            return { name };
        }
        return { name: String(name) };
    }
    return undefined;
}
