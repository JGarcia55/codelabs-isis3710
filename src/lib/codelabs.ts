import fs from "fs";
import path from "path";
import { Codelab } from "@/types";

const DATA_DIR = path.join(process.cwd(), "public", "data", "codelabs");

export function getAllCodelabs(): Codelab[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();
  return files
    .map((f) => {
      try {
        const content = fs.readFileSync(path.join(DATA_DIR, f), "utf-8");
        return JSON.parse(content) as Codelab;
      } catch {
        return null;
      }
    })
    .filter((c): c is Codelab => c !== null)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getCodelab(slug: string): Codelab | null {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as Codelab;
  } catch {
    return null;
  }
}
