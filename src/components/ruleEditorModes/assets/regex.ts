export function normalizeRegexSource(source: string): string {
    return source === "(?:)" ? "" : source;
}

export function safeCreateRegex(source: string, flags?: string): RegExp {
    try {
        return new RegExp(source, flags);
    } catch (e) {
        console.error("Invalid regex source:", source, e);
        return new RegExp("");
    }
}
