import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./content-types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
  const json = JSON.stringify(content, null, 2) + "\n";
  await fs.writeFile(CONTENT_PATH, json, "utf-8");
}
