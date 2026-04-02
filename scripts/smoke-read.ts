/**
 * Read-only smoke test for the same HTTP paths as BILLZ_MCP_MODE=analytics tools.
 * Run from repo root: cd billz_mcp && npx tsx scripts/smoke-read.ts
 * Loads ../../.env then ../.env if BILLZ_SECRET_KEY is unset.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { billzFetch } from "../src/billz-client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFiles() {
  const candidates = [
    resolve(__dirname, "..", "..", ".env"),
    resolve(__dirname, "..", ".env"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq <= 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

function todayYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function firstOrderIdFromOrderSearch(raw: unknown): string | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const inner = (
    o.data && typeof o.data === "object" ? o.data : o
  ) as Record<string, unknown>;
  const list = inner.orders_sorted_by_date_list;
  if (!Array.isArray(list)) return undefined;
  for (const day of list) {
    if (!day || typeof day !== "object") continue;
    const orders = (day as { orders?: unknown[] }).orders;
    if (!Array.isArray(orders)) continue;
    for (const ord of orders) {
      if (ord && typeof ord === "object" && "id" in ord) {
        const id = (ord as { id?: string }).id;
        if (id) return id;
      }
    }
  }
  return undefined;
}

function unwrapShops(raw: unknown): { id?: string }[] {
  if (Array.isArray(raw)) return raw as { id?: string }[];
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const inner = o.data;
    if (inner && typeof inner === "object") {
      const d = inner as Record<string, unknown>;
      if (Array.isArray(d.shops)) return d.shops as { id?: string }[];
      if (Array.isArray(d.data)) return d.data as { id?: string }[];
    }
    if (Array.isArray(o.shops)) return o.shops as { id?: string }[];
    if (Array.isArray(o.data)) return o.data as { id?: string }[];
  }
  return [];
}

type Check = { name: string; ok: boolean; detail?: string };

async function main() {
  loadEnvFiles();
  if (!process.env.BILLZ_SECRET_KEY) {
    console.error(
      [
        "Missing BILLZ_SECRET_KEY.",
        "  Same value as Shop Settings → Billz integration key (not in root .env if you only store it in DB).",
        "  Run:  BILLZ_SECRET_KEY='your_key' npx tsx scripts/smoke-read.ts",
        "  Or add BILLZ_SECRET_KEY=... to billz_mcp/.env",
      ].join("\n"),
    );
    process.exit(1);
  }

  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 7);
  const startDate = todayYmd(start);
  const endDate = todayYmd(end);
  const reportDate = endDate;

  const checks: Check[] = [];

  async function run<T>(
    name: string,
    fn: () => Promise<T>,
    summarize?: (r: T) => string,
  ) {
    try {
      const r = await fn();
      if (r && typeof r === "object" && "error" in r && (r as { error?: boolean }).error === true) {
        const e = r as { status?: number; message?: string };
        checks.push({
          name,
          ok: false,
          detail: `HTTP ${e.status ?? "?"} ${(e.message ?? "").slice(0, 200)}`,
        });
        return undefined;
      }
      const s = summarize?.(r as T) ?? "ok";
      checks.push({ name, ok: true, detail: s });
      return r as T;
    } catch (e) {
      checks.push({
        name,
        ok: false,
        detail: e instanceof Error ? e.message : String(e),
      });
      return undefined;
    }
  }

  const shopsRaw = await run("GET /v1/shop (billz_get_shops)", () =>
    billzFetch("GET", "/v1/shop", {
      params: { limit: 100, only_allowed: true },
    }),
  );

  const shops = unwrapShops(shopsRaw);
  const shopIds = shops
    .map((s) => s.id)
    .filter(Boolean)
    .join(",");

  if (shopIds) {
    console.log(`Resolved shop_ids (${shops.length} shops): ${shopIds.slice(0, 80)}${shopIds.length > 80 ? "…" : ""}\n`);
  } else {
    console.log("Warning: no shop IDs from /v1/shop — report calls may 400.\n");
  }

  const common = {
    start_date: startDate,
    end_date: endDate,
    ...(shopIds ? { shop_ids: shopIds } : {}),
  };

  await run("GET /v2/products (billz_get_products)", () =>
    billzFetch("GET", "/v2/products", { params: { limit: 3, page: 1 } }),
    (r) => {
      const o = r as Record<string, unknown>;
      const d = o?.data;
      const n = Array.isArray(d) ? d.length : "?";
      return `items ~ ${n}`;
    },
  );

  await run("POST /v2/product-search-with-filters (billz_filter_products)", () =>
    billzFetch("POST", "/v2/product-search-with-filters", {
      body: { status: "active", limit: 2, page: 1 },
    }),
    () => "posted",
  );

  await run("GET /v1/client (billz_get_customers)", () =>
    billzFetch("GET", "/v1/client", { params: { limit: 3, page: 1 } }),
  );

  let firstCustomerId: string | undefined;
  const clientsRaw = await billzFetch("GET", "/v1/client", {
    params: { limit: 1, page: 1 },
  });
  if (
    clientsRaw &&
    typeof clientsRaw === "object" &&
    !("error" in clientsRaw && (clientsRaw as { error?: boolean }).error)
  ) {
    const cr = clientsRaw as Record<string, unknown>;
    const data = cr.data;
    const arr = Array.isArray(data)
      ? data
      : data && typeof data === "object" && Array.isArray((data as { clients?: unknown[] }).clients)
        ? (data as { clients: unknown[] }).clients
        : [];
    const first = arr[0] as { id?: string } | undefined;
    firstCustomerId = first?.id;
  }

  if (firstCustomerId) {
    await run(`GET /v1/customer/${firstCustomerId} (billz_get_customer)`, () =>
      billzFetch("GET", `/v1/customer/${firstCustomerId}`),
    );
    await run("GET /v1/debt-stats (billz_get_debt_stats)", () =>
      billzFetch("GET", "/v1/debt-stats", {
        params: { customer_id: firstCustomerId },
      }),
    );
  } else {
    checks.push({
      name: "GET /v1/customer/:id + debt-stats",
      ok: true,
      detail: "skipped (no customer in list)",
    });
  }

  await run("GET /v3/order-search (billz_get_sales)", () =>
    billzFetch("GET", "/v3/order-search", {
      params: {
        limit: 2,
        page: 1,
        start_date: startDate,
        end_date: endDate,
        ...(shopIds ? { shop_ids: shopIds } : {}),
      },
    }),
  );

  let firstOrderId: string | undefined;
  const ordersRaw = await billzFetch("GET", "/v3/order-search", {
    params: {
      limit: 1,
      page: 1,
      start_date: startDate,
      end_date: endDate,
      ...(shopIds ? { shop_ids: shopIds } : {}),
    },
  });
  if (
    ordersRaw &&
    typeof ordersRaw === "object" &&
    !("error" in ordersRaw && (ordersRaw as { error?: boolean }).error)
  ) {
    firstOrderId = firstOrderIdFromOrderSearch(ordersRaw);
  }

  if (firstOrderId) {
    await run(`GET /v2/order/${firstOrderId} (billz_get_sale_details)`, () =>
      billzFetch("GET", `/v2/order/${firstOrderId}`),
    );
  } else {
    checks.push({
      name: "GET /v2/order/:id (billz_get_sale_details)",
      ok: true,
      detail: "skipped (no orders in range)",
    });
  }

  await run("GET /v1/general-report-table (billz_report_general_table)", () =>
    billzFetch("GET", "/v1/general-report-table", {
      params: { ...common, detalization: "day", limit: 10 },
    }),
  );

  await run("GET /v1/general-report (billz_report_general_totals)", () =>
    billzFetch("GET", "/v1/general-report", { params: common }),
  );

  await run("GET /v1/product-general-table (billz_report_products_table)", () =>
    billzFetch("GET", "/v1/product-general-table", {
      params: { ...common, limit: 5 },
    }),
  );

  await run("GET /v1/customer-general-table (billz_report_customers_table)", () =>
    billzFetch("GET", "/v1/customer-general-table", {
      params: { ...common, limit: 5 },
    }),
  );

  await run("GET /v1/profit-and-lose (billz_report_profit_loss)", () =>
    billzFetch("GET", "/v1/profit-and-lose", { params: common }),
  );

  await run("GET /v1/stock-report-table (billz_report_stock)", () =>
    billzFetch("GET", "/v1/stock-report-table", {
      params: {
        report_date: reportDate,
        ...(shopIds ? { shop_ids: shopIds } : {}),
        limit: 5,
      },
    }),
  );

  await run("GET /v2/category (billz_get_categories)", () =>
    billzFetch("GET", "/v2/category", { params: { limit: 3, page: 1 } }),
  );

  await run("GET /v2/brand (billz_get_brands)", () =>
    billzFetch("GET", "/v2/brand", { params: { limit: 3, page: 1 } }),
  );

  await run("GET /v2/product-characteristic (billz_get_product_characteristics)", () =>
    billzFetch("GET", "/v2/product-characteristic", { params: { limit: 5 } }),
  );

  const okCount = checks.filter((c) => c.ok).length;
  const failCount = checks.length - okCount;

  console.log("── BILLZ analytics read smoke (unique routes) ──\n");
  for (const c of checks) {
    const mark = c.ok ? "✓" : "✗";
    console.log(`${mark} ${c.name}`);
    if (c.detail) console.log(`    ${c.detail}`);
  }
  console.log(`\n${okCount}/${checks.length} passed`);
  if (failCount > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
