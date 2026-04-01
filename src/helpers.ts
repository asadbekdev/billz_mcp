import type { BillzError } from "./billz-client.js";

export function ok(data: unknown) {
  if (isBillzError(data)) {
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      isError: true,
    };
  }
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function isBillzError(v: unknown): v is BillzError {
  return (
    typeof v === "object" &&
    v !== null &&
    (v as BillzError).error === true &&
    typeof (v as BillzError).status === "number"
  );
}
