import { copyFile, mkdir, readdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { portfolioContentSchema, type PortfolioContent } from "@/lib/schema";

export const contentPath = path.join(process.cwd(), "src", "data", "content.json");
export const uploadsPath = path.join(process.cwd(), "public", "uploads");
const revisionsPath = path.join(process.cwd(), "data", "revisions");

function parseContent(raw: string): PortfolioContent {
  return portfolioContentSchema.parse(JSON.parse(raw));
}

export function getContent(): PortfolioContent {
  return parseContent(readFileSync(contentPath, "utf8"));
}

export async function readContent(): Promise<PortfolioContent> {
  return parseContent(await readFile(contentPath, "utf8"));
}

export async function saveContent(input: unknown) {
  const content = portfolioContentSchema.parse(input);
  await mkdir(revisionsPath, { recursive: true });
  if (existsSync(contentPath)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await copyFile(contentPath, path.join(revisionsPath, `${stamp}.json`));
  }
  const temporaryPath = `${contentPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(temporaryPath, contentPath);
  await pruneRevisions();
  return content;
}

async function pruneRevisions() {
  const files = (await readdir(revisionsPath)).filter((file) => file.endsWith(".json")).sort().reverse();
  await Promise.all(files.slice(30).map((file) => unlink(path.join(revisionsPath, file))));
}

export async function listRevisions() {
  await mkdir(revisionsPath, { recursive: true });
  return (await readdir(revisionsPath)).filter((file) => file.endsWith(".json")).sort().reverse();
}

export async function restoreRevision(fileName: string) {
  if (!/^\d{4}-\d{2}-\d{2}T[\d-]+Z\.json$/.test(fileName)) throw new Error("Revision no valida");
  return saveContent(parseContent(await readFile(path.join(revisionsPath, fileName), "utf8")));
}

export async function ensureUploadsDir() {
  await mkdir(uploadsPath, { recursive: true });
}
