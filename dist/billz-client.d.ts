export declare function getToken(): Promise<string>;
export declare function billzFetch(method: string, path: string, options?: {
    params?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    headers?: Record<string, string>;
}): Promise<unknown>;
