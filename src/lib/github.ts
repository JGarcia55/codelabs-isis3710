import { Codelab } from "@/types";

const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || "JGarcia55";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "codelabs-isis3710";
const TOKEN = process.env.NEXT_PUBLIC_CODELABS_PAT || "";

const BASE_URL = "https://api.github.com";

let _operationInProgress = false;
type Listener = (busy: boolean) => void;
const _listeners: Listener[] = [];

export function isOperationInProgress(): boolean {
  return _operationInProgress;
}

export function onOperationStatusChange(cb: Listener): () => void {
  _listeners.push(cb);
  return () => {
    const idx = _listeners.indexOf(cb);
    if (idx !== -1) _listeners.splice(idx, 1);
  };
}

function setOperationBusy(busy: boolean) {
  _operationInProgress = busy;
  _listeners.forEach((cb) => cb(busy));
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const bin = Array.from(bytes, (b) => String.fromCodePoint(b)).join("");
  return btoa(bin);
}

export function base64ToUtf8(str: string): string {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export async function deleteCodelab(slug: string): Promise<boolean> {
  if (_operationInProgress) return false;
  if (!TOKEN) {
    console.error("GitHub PAT not configured");
    return false;
  }

  const path = `public/data/codelabs/${slug}.json`;
  const url = `${BASE_URL}/repos/${OWNER}/${REPO}/contents/${path}`;

  setOperationBusy(true);
  try {
    const getRes = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!getRes.ok) return false;

    const data = (await getRes.json()) as { sha: string };

    const delRes = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete codelab: ${slug}`,
        sha: data.sha,
      }),
    });

    return delRes.ok;
  } finally {
    setOperationBusy(false);
  }
}

export async function saveCodelab(codelab: Codelab): Promise<boolean> {
  if (_operationInProgress) return false;
  if (!TOKEN) {
    console.error("GitHub PAT not configured");
    return false;
  }

  const path = `public/data/codelabs/${codelab.slug}.json`;
  const url = `${BASE_URL}/repos/${OWNER}/${REPO}/contents/${path}`;

  setOperationBusy(true);
  try {
    const existing = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const body: Record<string, unknown> = {
      message: `${existing.ok ? "Update" : "Add"} codelab: ${codelab.slug}`,
      content: utf8ToBase64(JSON.stringify(codelab, null, 2)),
    };

    if (existing.ok) {
      const existingData = await existing.json();
      body.sha = (existingData as { sha: string }).sha;
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("GitHub API error:", err);
      return false;
    }

    return true;
  } finally {
    setOperationBusy(false);
  }
}

export async function listCodelabs(): Promise<Codelab[]> {
  if (!TOKEN) return [];

  const url = `${BASE_URL}/repos/${OWNER}/${REPO}/contents/public/data/codelabs`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) return [];

  const files = (await res.json()) as { name: string; download_url: string }[];
  const jsonFiles = files.filter((f) => f.name.endsWith(".json"));

  const codelabs: Codelab[] = [];
  for (const file of jsonFiles) {
    try {
      const contentRes = await fetch(file.download_url);
      const data = (await contentRes.json()) as Codelab;
      codelabs.push(data);
    } catch {
      // skip invalid files
    }
  }

  return codelabs.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
