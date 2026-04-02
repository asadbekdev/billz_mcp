const BASE_URL = "https://api-admin.billz.ai";

const PLATFORM_ID =
  process.env.BILLZ_PLATFORM_ID ?? "7d4a4c38-dd84-4902-b744-0488b80a4c01";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/** Same unwrap as main app — login returns `{ data: { access_token } }`. */
function unwrapData<T>(body: unknown): T {
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    (body as { data: unknown }).data !== null &&
    (body as { data: unknown }).data !== undefined
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export function getPlatformId(): string {
  return PLATFORM_ID;
}

async function authenticate(): Promise<string> {
  const secretKey = process.env.BILLZ_SECRET_KEY;
  if (!secretKey) throw new Error("BILLZ_SECRET_KEY env var not set");

  const attempts = [{ secret_token: secretKey }, { secret_key: secretKey }];
  let lastErr = "Billz auth failed";

  for (const loginBody of attempts) {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify(loginBody),
    });
    const body = (await res.json()) as unknown;
    if (!res.ok) {
      lastErr =
        typeof body === "object" && body && "message" in body
          ? String((body as { message?: string }).message)
          : JSON.stringify(body);
      continue;
    }

    const data = unwrapData<{ access_token?: string }>(body);
    const token = data.access_token;
    if (!token) {
      lastErr = "no access_token in response";
      continue;
    }

    cachedToken = token;
    tokenExpiry = Date.now() + 14 * 24 * 60 * 60 * 1000;
    return cachedToken;
  }

  throw new Error(`Billz auth failed: ${lastErr}`);
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  return authenticate();
}

function clearToken(): void {
  cachedToken = null;
  tokenExpiry = 0;
}

export interface BillzError {
  error: true;
  status: number;
  message: string;
}

export interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  /** Automatically adds Billz-Response-Channel: HTTP header */
  httpResponse?: boolean;
}

export async function billzFetch(
  method: string,
  path: string,
  options: FetchOptions = {},
): Promise<unknown> {
  const token = await getToken();
  const result = await doFetch(method, path, token, options);

  if (isAuthError(result)) {
    clearToken();
    const freshToken = await authenticate();
    return doFetch(method, path, freshToken, options);
  }

  return result;
}

function isAuthError(result: unknown): result is BillzError {
  return (
    typeof result === "object" &&
    result !== null &&
    (result as BillzError).error === true &&
    (result as BillzError).status === 401
  );
}

async function doFetch(
  method: string,
  path: string,
  token: string,
  options: FetchOptions,
): Promise<unknown> {
  let url = `${BASE_URL}${path}`;
  if (options.params) {
    const q = Object.entries(options.params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => {
        const raw = String(v);
        const encoded = raw.includes(",")
          ? raw.split(",").map(encodeURIComponent).join(",")
          : encodeURIComponent(raw);
        return `${encodeURIComponent(k)}=${encoded}`;
      })
      .join("&");
    if (q) url += (url.includes("?") ? "&" : "?") + q;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (options.httpResponse) {
    headers["Billz-Response-Channel"] = "HTTP";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();

  if (!res.ok) {
    return { error: true, status: res.status, message: text } satisfies BillzError;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
