function isObject<T>(value: unknown): value is T {
    return typeof value === 'object' && value !== null;
}

export const withObjectValue = <T extends {}>(obj: T, key: keyof T): string | null => {
    if (isObject(obj) && Object.hasOwn(obj, key)) {
        return obj[key]
    }
    return null;
}