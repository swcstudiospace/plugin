import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	createIssue,
	ensureRepo,
	formatIssueBody,
	isRepo,
	issueLinks,
	listIssues,
	parseIssueFile,
	readIssue,
} from "./tissue.ts";
import { TISSUE_DIR, TISSUE_MARKER, TISSUE_VERSION } from "./types.ts";

const tempDirs: string[] = [];

function tmp(): string {
	const dir = mkdtempSync(join(tmpdir(), "aio-tissue-"));
	tempDirs.push(dir);
	return dir;
}

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		rmSync(dir, { recursive: true, force: true });
	}
});

describe("ensureRepo", () => {
	test("creates marker and is idempotent", () => {
		const root = tmp();
		expect(isRepo(root)).toBe(false);
		ensureRepo(root);
		expect(isRepo(root)).toBe(true);
		const marker = join(root, TISSUE_DIR, TISSUE_MARKER);
		expect(readFileSync(marker, "utf8")).toBe(`${JSON.stringify({ version: TISSUE_VERSION })}\n`);
		writeFileSync(marker, '{"version":"custom"}\n');
		ensureRepo(root);
		expect(readFileSync(marker, "utf8")).toBe('{"version":"custom"}\n');
		expect(isRepo(root)).toBe(true);
	});
});

describe("listIssues", () => {
	test("missing repo returns []", () => {
		const root = tmp();
		expect(isRepo(root)).toBe(false);
		expect(listIssues(root)).toEqual([]);
		expect(readIssue(root, "missing")).toBeUndefined();
	});
});

describe("createIssue", () => {
	test("create + list + read", () => {
		const root = tmp();
		const now = () => 1_234_567_890_123;
		const issue = createIssue(root, "Hello world", "body text", { now });
		const id = (1_234_567_890_123).toString(36);
		expect(issue.id).toBe(id);
		expect(issue.title).toBe("Hello world");
		expect(issue.description).toBe("body text");
		expect(issue.fileName).toBe(`${id}-Hello world.md`);
		expect(issue.path).toBe(join(root, TISSUE_DIR, issue.fileName));
		expect(existsSync(issue.path)).toBe(true);
		expect(readFileSync(issue.path, "utf8")).toBe("# Hello world\nbody text\n");

		const listed = listIssues(root);
		expect(listed).toHaveLength(1);
		expect(listed[0]?.id).toBe(id);
		expect(listed[0]?.title).toBe("Hello world");
		expect(listed[0]?.description).toBe("body text");
		expect(listed[0]?.fileName).toBe(issue.fileName);
		expect(listed[0]?.path).toBe(issue.path);

		const read = readIssue(root, id);
		expect(read).toEqual(issue);
	});

	test("slash and backslash in title are stripped from filename", () => {
		const root = tmp();
		const issue = createIssue(root, "a/b\\c", "d", { now: () => 1 });
		expect(issue.id).toBe("1");
		expect(issue.title).toBe("a/b\\c");
		expect(issue.fileName).toBe("1-abc.md");
		expect(readFileSync(issue.path, "utf8")).toBe("# a/b\\c\nd\n");
		expect(readIssue(root, "1")?.title).toBe("a/b\\c");
	});
});

describe("parseIssueFile", () => {
	test("reads heading and id from filename", () => {
		const root = tmp();
		ensureRepo(root);
		const path = join(root, TISSUE_DIR, "zz-sample.md");
		writeFileSync(path, "# Sample\nhello\n");
		expect(parseIssueFile(path)).toEqual({
			id: "zz",
			title: "Sample",
			description: "hello",
			path,
			fileName: "zz-sample.md",
		});
	});

	test("skips unreadable and non-issue files", () => {
		const root = tmp();
		ensureRepo(root);
		mkdirSync(join(root, TISSUE_DIR, "archive"));
		writeFileSync(join(root, TISSUE_DIR, "archive", "x-hidden.md"), "# Hidden\n");
		writeFileSync(join(root, TISSUE_DIR, "not-an-issue.txt"), "nope");
		expect(listIssues(root)).toEqual([]);
	});
});

describe("formatIssueBody", () => {
	test("joins title and description with trailing newline", () => {
		expect(formatIssueBody({ title: "T", description: "D" })).toBe("# T\nD\n");
		expect(formatIssueBody({ title: "T", description: "" })).toBe("# T\n");
	});

	test("issueLinks writes the Links block", () => {
		expect(issueLinks("abc")).toBe("## Links\n- tissue: abc\n");
		expect(
			issueLinks("abc", { remoteUrl: "https://github.com/o/r.git", slug: "o/r" }),
		).toBe("## Links\n- tissue: abc\n- github: https://github.com/o/r.git\n- repo: o/r\n");
	});
});
