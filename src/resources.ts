import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DOCS_DIR = join(__dirname, "..", "billz_api_docs_en");

interface DocEntry {
  name: string;
  path: string;
  key: string;
}

function collectDocs(dir: string, entries: DocEntry[] = []): DocEntry[] {
  for (const item of readdirSync(dir)) {
    const full = join(dir, item);
    if (statSync(full).isDirectory()) {
      collectDocs(full, entries);
    } else if (item.endsWith(".md")) {
      const rel = relative(DOCS_DIR, full).replace(/\\/g, "/");
      const key = rel.replace(/\.md$/, "").toLowerCase().replace(/\//g, "--");
      const name = basename(item, ".md").replace(/-/g, " ");
      entries.push({ name, path: full, key });
    }
  }
  return entries;
}

export function register(server: McpServer) {
  let docs: DocEntry[];
  try {
    docs = collectDocs(DOCS_DIR);
  } catch {
    return;
  }

  server.resource(
    "billz-api-doc",
    new ResourceTemplate("billz://docs/{key}", { list: undefined }),
    {
      description: "BILLZ API documentation pages",
      mimeType: "text/markdown",
    },
    async (uri, { key }) => {
      const doc = docs.find((d) => d.key === key);
      if (!doc) {
        return { contents: [{ uri: uri.href, mimeType: "text/plain", text: `Doc not found: ${key}` }] };
      }
      const text = readFileSync(doc.path, "utf-8");
      return { contents: [{ uri: uri.href, mimeType: "text/markdown", text }] };
    },
  );

  for (const doc of docs) {
    server.resource(
      `doc-${doc.key}`,
      `billz://docs/${doc.key}`,
      { description: `BILLZ API: ${doc.name}`, mimeType: "text/markdown" },
      async (uri) => {
        const text = readFileSync(doc.path, "utf-8");
        return { contents: [{ uri: uri.href, mimeType: "text/markdown", text }] };
      },
    );
  }
}
