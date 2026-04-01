const BASE_URL = "https://api-admin.billz.ai";
let cachedToken = null;
let tokenExpiry = 0;
export async function getToken() {
    const secretKey = process.env.BILLZ_SECRET_KEY;
    if (!secretKey)
        throw new Error("BILLZ_SECRET_KEY env var not set");
    if (cachedToken && Date.now() < tokenExpiry)
        return cachedToken;
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret_key: secretKey }),
    });
    if (!res.ok)
        throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
    const data = (await res.json());
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + 14 * 24 * 60 * 60 * 1000;
    return cachedToken;
}
export async function billzFetch(method, path, options = {}) {
    const token = await getToken();
    let url = `${BASE_URL}${path}`;
    if (options.params) {
        const q = Object.entries(options.params)
            .filter(([, v]) => v !== undefined && v !== "")
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join("&");
        if (q)
            url += `?${q}`;
    }
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
    };
    const res = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const text = await res.text();
    if (!res.ok)
        throw new Error(`BILLZ API error ${res.status}: ${text}`);
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
