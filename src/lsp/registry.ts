import { existsSync, readdirSync } from "node:fs";
import { delimiter, dirname, join } from "node:path";
import type { LspLanguage } from "./types.ts";

export type { LspLanguage };

export interface LspLanguageSpec {
	id: LspLanguage;
	languageIds: string[];
	extensions: string[];
	rootMarkers: string[];
	specialist: string;
	candidates: string[][];
	stdioNote?: string;
}

export const LSP_LANGUAGES: LspLanguageSpec[] = [
	{
		id: "csharp",
		languageIds: ["csharp"],
		extensions: [".cs", ".csx"],
		rootMarkers: ["*.sln", "*.csproj", "Directory.Build.props", "global.json"],
		specialist: "be-api",
		candidates: [["csharp-ls"], ["OmniSharp"], ["omnisharp"]],
	},
	{
		id: "rust",
		languageIds: ["rust"],
		extensions: [".rs"],
		rootMarkers: ["Cargo.toml", "rust-project.json"],
		specialist: "be-reliability",
		candidates: [["rust-analyzer"]],
	},
	{
		id: "java",
		languageIds: ["java"],
		extensions: [".java"],
		rootMarkers: ["pom.xml", "build.gradle", "build.gradle.kts", "settings.gradle"],
		specialist: "be-api",
		candidates: [["jdtls"], ["java-language-server"]],
	},
	{
		id: "python",
		languageIds: ["python"],
		extensions: [".py", ".pyi"],
		rootMarkers: ["pyproject.toml", "setup.cfg", "setup.py", "requirements.txt", "Pipfile"],
		specialist: "be-data",
		candidates: [
			["pyright-langserver", "--stdio"],
			["basedpyright-langserver", "--stdio"],
			["pylsp"],
		],
	},
	{
		id: "typescript",
		languageIds: ["typescript", "javascript", "typescriptreact", "javascriptreact"],
		extensions: [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs"],
		rootMarkers: ["package.json", "tsconfig.json", "jsconfig.json"],
		specialist: "fe-ui",
		candidates: [
			["typescript-language-server", "--stdio"],
			["vtsls", "--stdio"],
		],
	},
	{
		id: "elixir",
		languageIds: ["elixir"],
		extensions: [".ex", ".exs", ".eex", ".heex"],
		rootMarkers: ["mix.exs"],
		specialist: "be-reliability",
		candidates: [["elixir-ls"], ["language_server.sh"]],
	},
	{
		id: "ocaml",
		languageIds: ["ocaml", "ocaml.interface"],
		extensions: [".ml", ".mli", ".mll", ".mly"],
		rootMarkers: ["dune-project", "dune-workspace", "*.opam"],
		specialist: "be-api",
		candidates: [["ocamllsp"], ["ocaml-lsp-server"]],
	},
	{
		id: "php",
		languageIds: ["php"],
		extensions: [".php", ".phtml"],
		rootMarkers: ["composer.json"],
		specialist: "be-api",
		candidates: [
			["intelephense", "--stdio"],
			["phpactor", "language-server"],
		],
	},
];

const EXTRA_BIN_DIRS = [
	"/usr/local/bin",
	"/usr/bin",
	join(process.env.HOME ?? "", ".local/bin"),
	join(process.env.HOME ?? "", ".cargo/bin"),
	join(process.env.HOME ?? "", ".dotnet/tools"),
	"/opt/elixir-ls",
];

export function which(cmd: string): string | undefined {
	if (!cmd) return undefined;
	if ((cmd.startsWith("/") || cmd.startsWith("./")) && existsSync(cmd)) return cmd;
	const dirs = [...(process.env.PATH?.split(delimiter) ?? []), ...EXTRA_BIN_DIRS];
	for (const dir of dirs) {
		if (!dir) continue;
		const candidate = join(dir, cmd);
		if (existsSync(candidate)) return candidate;
	}
	return undefined;
}

export function resolveCommand(argv: string[]): { command: string; args: string[] } | undefined {
	if (argv.length === 0) return undefined;
	const resolved = which(argv[0] ?? "");
	if (!resolved) return undefined;
	return { command: resolved, args: argv.slice(1) };
}

export function specForExtension(filePath: string): LspLanguageSpec | undefined {
	const lower = filePath.toLowerCase();
	return LSP_LANGUAGES.find((spec) => spec.extensions.some((ext) => lower.endsWith(ext)));
}

export function languageIdFor(spec: LspLanguageSpec, filePath: string): string {
	const lower = filePath.toLowerCase();
	if (spec.id === "typescript") {
		if (lower.endsWith(".tsx")) return "typescriptreact";
		if (lower.endsWith(".jsx")) return "javascriptreact";
		if (lower.endsWith(".js") || lower.endsWith(".mjs") || lower.endsWith(".cjs")) return "javascript";
		return "typescript";
	}
	if (spec.id === "ocaml" && lower.endsWith(".mli")) return "ocaml.interface";
	return spec.languageIds[0] ?? spec.id;
}

export function probeLanguage(
	spec: LspLanguageSpec,
	override?: string[],
): {
	found: boolean;
	command?: string;
	args: string[];
} {
	const ranked = override && override.length > 0 ? [override, ...spec.candidates] : spec.candidates;
	for (const argv of ranked) {
		const resolved = resolveCommand(argv);
		if (resolved) return { found: true, command: resolved.command, args: resolved.args };
	}
	return { found: false, args: [] };
}

export function findRoot(dir: string, markers: string[], fallback: string): string {
	let current = dir;
	for (let i = 0; i < 24; i++) {
		for (const marker of markers) {
			if (dirHasMarker(current, marker)) return current;
		}
		const parent = dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return fallback;
}

function dirHasMarker(dir: string, marker: string): boolean {
	if (marker.startsWith("*.")) {
		const ext = marker.slice(1);
		try {
			return readdirSync(dir).some((name) => name.endsWith(ext));
		} catch {
			return false;
		}
	}
	return existsSync(join(dir, marker));
}
