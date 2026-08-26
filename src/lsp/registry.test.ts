import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { findRoot, probeLanguage, specForExtension, type LspLanguageSpec } from "./registry.ts";

const FAKE: LspLanguageSpec = {
	id: "rust",
	languageIds: ["rust"],
	extensions: [".rs"],
	rootMarkers: ["Cargo.toml"],
	specialist: "be-reliability",
	candidates: [["definitely-not-an-lsp-bin-xyzzy"]],
};

describe("specForExtension", () => {
	test("maps .rs to rust", () => {
		expect(specForExtension("src/main.rs")?.id).toBe("rust");
	});

	test("maps .ts to typescript", () => {
		expect(specForExtension("src/app.ts")?.id).toBe("typescript");
	});
});

describe("probeLanguage", () => {
	test("found is false for a fake bin", () => {
		expect(probeLanguage(FAKE).found).toBe(false);
	});
});

describe("findRoot", () => {
	test("walks up to Cargo.toml", () => {
		const root = mkdtempSync(join(tmpdir(), "aio-lsp-root-"));
		writeFileSync(join(root, "Cargo.toml"), "[package]\nname = \"demo\"\nversion = \"0.0.0\"\n");
		const nested = join(root, "src", "inner");
		mkdirSync(nested, { recursive: true });
		expect(findRoot(nested, ["Cargo.toml"], "/fallback")).toBe(root);
	});
});
