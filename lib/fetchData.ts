import { apiToken, apiUrl } from "./config";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
}

export async function fetchData(endpoint: string, options: FetchOptions = {}) {
  const { method = "GET", body } = options;

  const res = await fetch(`${apiUrl}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store", // opsional
  });

  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
