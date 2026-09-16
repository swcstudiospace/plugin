import type { NotionClient } from "./client.ts";
import { NOTION_DATABASE_TITLE } from "./types.ts";

export async function ensureDatabase(client: NotionClient, parentPageId: string): Promise<string> {
	const found = await client.findDatabase(parentPageId, NOTION_DATABASE_TITLE);
	if ("error" in found) throw new Error(`notion findDatabase failed: ${found.error}`);
	if (found.id) return found.id;

	const created = await client.createDatabase(parentPageId, NOTION_DATABASE_TITLE);
	if ("error" in created) throw new Error(`notion createDatabase failed: ${created.error}`);
	return created.id;
}
