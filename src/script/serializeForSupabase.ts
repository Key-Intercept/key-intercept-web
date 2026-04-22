type JsonLike = null | boolean | number | string | JsonLike[] | { [key: string]: JsonLike };

function isUnsafeInteger(value: number): boolean {
  return Number.isInteger(value) && !Number.isSafeInteger(value);
}

export function serializeForSupabase<T>(value: T): T {
  if (typeof value === 'bigint') {
    return value.toString() as T;
  }

  if (typeof value === 'number' && isUnsafeInteger(value)) {
    return value.toString() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeForSupabase(item)) as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, JsonLike> = {};
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      result[key] = serializeForSupabase(nestedValue) as JsonLike;
    }
    return result as T;
  }

  return value;
}