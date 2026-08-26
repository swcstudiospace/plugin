import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { importHermesSkills, loadReport, writeReport } from "./import.ts";

function hermesTree(): { source: string; dest: string; cleanup: () => void } {
	const root = mkdtempSync(join(tmpdir(), "aio-hermes-"));
	const source = join(root, "skills");
	const dest = join(root, "out");
	mkdirSync(join(source, "software-development", "demo-skill"), { recursive: true });
	writeFileSync(
		join(source, "software-development", "demo-skill", "SKILL.md"),
		`---\nname: demo-skill\ndescription: Use when testing the importer.\n---\n\n# Demo\n`,
	);
	mkdirSync(join(source, "software-development", "demo-skill", "references"), { recursive: true });
	writeFileSync(join(source, "software-development", "demo-skill", "references", "note.md"), "ok\n");
	mkdirSync(join(source, "broken"), { recursive: true });
	writeFileSync(join(source, "broken", "SKILL.md"), "# no frontmatter\n");
	mkdirSync(join(source, "secret-skill"), { recursive: true });
	writeFileSync(
		join(source, "secret-skill", "SKILL.md"),
		`---\nname: secret-skill\ndescription: Has a secret sibling.\n---\n\n# Secret\n`,
	);
	writeFileSync(join(source, "secret-skill", ".env"), "TOKEN=nope\n");
	writeFileSync(join(source, "secret-skill", "auth.json"), '{"token":"nope"}\n');
	return {
		source,
		dest,
		cleanup: () => rmSync(root, { recursive: true, force: true }),
	};
}

describe("importHermesSkills", () => {
	test("copies nested skill to flat dest and skips invalid/secret files", () => {
		const { source, dest, cleanup } = hermesTree();
		try {
			const report = importHermesSkills({ sourceDir: source, destDir: dest });
			expect(report.imported).toContain("demo-skill");
			expect(report.imported).toContain("secret-skill");
			expect(report.skipped.some((row) => row.name === "broken")).toBe(true);
			expect(readFileSync(join(dest, "demo-skill", "SKILL.md"), "utf8")).toContain("Use when testing");
			expect(readFileSync(join(dest, "demo-skill", "references", "note.md"), "utf8")).toBe("ok\n");
			expect(report.redacted.some((row) => row.path.endsWith("auth.json"))).toBe(true);
			expect(() => readFileSync(join(dest, "secret-skill", ".env"))).toThrow();
			expect(() => readFileSync(join(dest, "secret-skill", "auth.json"))).toThrow();
			writeReport(dest, report);
			expect(loadReport(join(dest, ".hermes-import.json"))?.imported).toContain("demo-skill");
		} finally {
			cleanup();
		}
	});

	test("second run is unchanged; dirty dest conflicts", () => {
		const { source, dest, cleanup } = hermesTree();
		try {
			const first = importHermesSkills({ sourceDir: source, destDir: dest });
			writeReport(dest, first);
			const second = importHermesSkills({
				sourceDir: source,
				destDir: dest,
				previous: loadReport(join(dest, ".hermes-import.json")),
			});
			expect(second.unchanged).toContain("demo-skill");
			expect(second.imported).not.toContain("demo-skill");
			writeFileSync(join(dest, "demo-skill", "SKILL.md"), "edited locally\n");
			const third = importHermesSkills({
				sourceDir: source,
				destDir: dest,
				previous: loadReport(join(dest, ".hermes-import.json")),
			});
			expect(third.conflicted.some((row) => row.name === "demo-skill")).toBe(true);
		} finally {
			cleanup();
		}
	});

	test("missing source does not throw", () => {
		const dest = mkdtempSync(join(tmpdir(), "aio-hermes-empty-"));
		try {
			const report = importHermesSkills({ sourceDir: join(dest, "nope"), destDir: join(dest, "out") });
			expect(report.skipped[0]?.reason).toContain("missing");
		} finally {
			rmSync(dest, { recursive: true, force: true });
		}
	});
});
