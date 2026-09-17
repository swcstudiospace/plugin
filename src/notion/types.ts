export interface NotionConfig {
	enabled: boolean;
	/** Name of the env var holding the Notion internal-integration secret. Never the secret itself. */
	apiKeyEnv: string;
	/** ID of the Notion page shared with the integration; the "PRs" database is created as its child. */
	parentPageId: string;
}

export const DEFAULT_NOTION_CONFIG: NotionConfig = {
	enabled: true,
	apiKeyEnv: "NOTION_API_KEY",
	parentPageId: "",
};

export const NOTION_DATABASE_TITLE = "PRs";
export const NOTION_API_VERSION = "2022-06-28";
export const NOTION_API_BASE = "https://api.notion.com/v1";
