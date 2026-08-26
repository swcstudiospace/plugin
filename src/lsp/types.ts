export type LspLanguage =
	| "csharp"
	| "rust"
	| "java"
	| "python"
	| "typescript"
	| "elixir"
	| "ocaml"
	| "php";

export type LspSeverity = "error" | "warning" | "info" | "hint";

export interface LspConfig {
	enabled: boolean;
	maxOpenDocs: number;
	maxDocBytes: number;
	debounceMs: number;
	idleTimeoutMs: number;
	initTimeoutMs: number;
	maxRestarts: number;
	restartWindowMs: number;
	parentSeverities: LspSeverity[];
	parentTopN: number;
	parentMaxBytes: number;
}

export const DEFAULT_LSP_CONFIG: LspConfig = {
	enabled: true,
	maxOpenDocs: 16,
	maxDocBytes: 750_000,
	debounceMs: 80,
	idleTimeoutMs: 15 * 60_000,
	initTimeoutMs: 20_000,
	maxRestarts: 3,
	restartWindowMs: 5 * 60_000,
	parentSeverities: ["error", "warning"],
	parentTopN: 12,
	parentMaxBytes: 2500,
};
