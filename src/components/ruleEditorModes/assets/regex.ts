export function normalizeRegexSource(source: string): string {
    return source === "(?:)" ? "" : source;
}
