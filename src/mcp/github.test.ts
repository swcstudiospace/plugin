import { describe, expect, test } from "bun:test";
import type { CliRunner } from "./types.ts";
import { createGithub } from "./github.ts";

function mockRun(
	script: (bin: string, args: string[], cwd?: string) => { stdout?: string; stderr?: string; code?: number } | Promise<{
		stdout?: string;
		stderr?: string;
		code?: number;
	}>,
): CliRunner & { calls: Array<{ bin: string; args: string[]; cwd?: string }> } {
	const calls: Array<{ bin: string; args: string[]; cwd?: string }> = [];
	const run: CliRunner = async (bin, args, cwd) => {
		calls.push({ bin, args, cwd });
		const result = await script(bin, args, cwd);
		return {
			stdout: result.stdout ?? "",
			stderr: result.stderr ?? "",
			code: result.code ?? 0,
		};
	};
	return Object.assign(run, { calls });
}

const VIEW_JSON = JSON.stringify({
	nameWithOwner: "swcstudiospace/plugin",
	defaultBranchRef: { name: "main" },
});

const REPO_JSON = JSON.stringify([
	{
		name: "plugin",
		nameWithOwner: "swcstudiospace/plugin",
		url: "https://github.com/swcstudiospace/plugin",
		isPrivate: true,
		defaultBranchRef: { name: "main" },
	},
]);

const PULL_JSON = JSON.stringify({
	number: 12,
	title: "Add MCP",
	url: "https://github.com/swcstudiospace/plugin/pull/12",
	state: "OPEN",
	headRefName: "feat/mcp",
	baseRefName: "main",
	mergedAt: null,
	isDraft: false,
});

const PULLS_JSON = JSON.stringify([
	{
		number: 12,
		title: "Add MCP",
		url: "https://github.com/swcstudiospace/plugin/pull/12",
		state: "OPEN",
		headRefName: "feat/mcp",
		baseRefName: "main",
		mergedAt: null,
	},
]);

describe("currentRepo", () => {
	test("parses nameWithOwner and default branch", async () => {
		const run = mockRun(() => ({ stdout: VIEW_JSON }));
		const github = createGithub({ run });
		const result = await github.currentRepo("/repo");
		expect(run.calls).toEqual([
			{ bin: "gh", args: ["repo", "view", "--json", "nameWithOwner,defaultBranchRef"], cwd: "/repo" },
		]);
		expect(result).toEqual({
			ok: true,
			owner: "swcstudiospace",
			repo: "plugin",
			nameWithOwner: "swcstudiospace/plugin",
			defaultBranch: "main",
		});
	});

	test("nonzero exit is ok false", async () => {
		const run = mockRun(() => ({ stderr: "not a git repo", code: 1 }));
		const result = await createGithub({ run }).currentRepo();
		expect(result).toEqual({ ok: false, error: "not a git repo" });
	});

	test("invalid JSON is ok false", async () => {
		const run = mockRun(() => ({ stdout: "not-json" }));
		const result = await createGithub({ run }).currentRepo();
		expect(result).toEqual({ ok: false, error: "invalid JSON" });
	});
});

describe("listRepos", () => {
	test("uses default org and maps JSON fields", async () => {
		const run = mockRun(() => ({ stdout: REPO_JSON }));
		const result = await createGithub({ run }).listRepos();
		expect(run.calls[0]).toEqual({
			bin: "gh",
			args: ["repo", "list", "swcstudiospace", "--limit", "100", "--json", "name,nameWithOwner,url,isPrivate,defaultBranchRef"],
			cwd: undefined,
		});
		expect(result).toEqual({
			ok: true,
			repos: [
				{
					name: "plugin",
					fullName: "swcstudiospace/plugin",
					htmlUrl: "https://github.com/swcstudiospace/plugin",
					private: true,
					defaultBranch: "main",
				},
			],
		});
	});

	test("overrides org from argument and factory", async () => {
		const run = mockRun(() => ({ stdout: "[]" }));
		await createGithub({ run, org: "factory-org" }).listRepos("arg-org");
		expect(run.calls[0]?.args).toEqual([
			"repo",
			"list",
			"arg-org",
			"--limit",
			"100",
			"--json",
			"name,nameWithOwner,url,isPrivate,defaultBranchRef",
		]);
	});

	test("nonzero exit is ok false", async () => {
		const run = mockRun(() => ({ stderr: "auth failed", code: 1 }));
		const result = await createGithub({ run }).listRepos();
		expect(result).toEqual({ ok: false, error: "auth failed" });
	});
});

describe("createRepo", () => {
	test("creates a private org repo without prompting", async () => {
		const run = mockRun(() => ({ stdout: "https://github.com/swcstudiospace/new-lib\n" }));
		const result = await createGithub({ run }).createRepo("new-lib", { private: true });
		expect(run.calls[0]?.args).toEqual([
			"repo",
			"create",
			"swcstudiospace/new-lib",
			"--private",
			"--clone=false",
			"--confirm",
		]);
		expect(result).toEqual({
			ok: true,
			repo: {
				name: "new-lib",
				fullName: "swcstudiospace/new-lib",
				htmlUrl: "https://github.com/swcstudiospace/new-lib",
				private: true,
				defaultBranch: "",
			},
		});
	});

	test("creates a public repo in an explicit org", async () => {
		const run = mockRun(() => ({ stdout: "" }));
		const result = await createGithub({ run }).createRepo("docs", { org: "acme" });
		expect(run.calls[0]?.args).toEqual(["repo", "create", "acme/docs", "--public", "--clone=false", "--confirm"]);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.repo.private).toBe(false);
			expect(result.repo.htmlUrl).toBe("https://github.com/acme/docs");
		}
	});
});

describe("createPull", () => {
	test("uses explicit owner/repo and optional base", async () => {
		const run = mockRun(() => ({ stdout: "https://github.com/swcstudiospace/plugin/pull/3\n" }));
		const result = await createGithub({ run }).createPull({
			title: "Ship it",
			body: "details",
			base: "main",
			owner: "swcstudiospace",
			repo: "plugin",
		});
		expect(run.calls).toEqual([
			{
				bin: "gh",
				args: [
					"pr",
					"create",
					"--repo",
					"swcstudiospace/plugin",
					"--title",
					"Ship it",
					"--body",
					"details",
					"--fill=false",
					"--base",
					"main",
				],
				cwd: undefined,
			},
		]);
		expect(result).toEqual({ ok: true, htmlUrl: "https://github.com/swcstudiospace/plugin/pull/3" });
	});

	test("resolves omitted owner/repo via currentRepo", async () => {
		const run = mockRun((_bin, args) => {
			if (args[0] === "repo") return { stdout: VIEW_JSON };
			return { stdout: "https://github.com/swcstudiospace/plugin/pull/4" };
		});
		const result = await createGithub({ run }).createPull({ title: "From cwd", cwd: "/work" });
		expect(run.calls[0]).toEqual({
			bin: "gh",
			args: ["repo", "view", "--json", "nameWithOwner,defaultBranchRef"],
			cwd: "/work",
		});
		expect(run.calls[1]?.args.slice(0, 8)).toEqual([
			"pr",
			"create",
			"--repo",
			"swcstudiospace/plugin",
			"--title",
			"From cwd",
			"--body",
			"",
		]);
		expect(result.ok).toBe(true);
	});
});

describe("listPulls", () => {
	test("lists pulls and maps JSON fields", async () => {
		const run = mockRun(() => ({ stdout: PULLS_JSON }));
		const result = await createGithub({ run }).listPulls({
			owner: "swcstudiospace",
			repo: "plugin",
			state: "open",
		});
		expect(run.calls[0]?.args).toEqual([
			"pr",
			"list",
			"--repo",
			"swcstudiospace/plugin",
			"--json",
			"number,title,url,state,headRefName,baseRefName,mergedAt",
			"--state",
			"open",
		]);
		expect(result).toEqual({
			ok: true,
			pulls: [
				{
					number: 12,
					title: "Add MCP",
					htmlUrl: "https://github.com/swcstudiospace/plugin/pull/12",
					state: "OPEN",
					headRef: "feat/mcp",
					baseRef: "main",
					merged: false,
				},
			],
		});
	});
});

describe("getPull", () => {
	test("views a pull and maps JSON fields", async () => {
		const run = mockRun(() => ({ stdout: PULL_JSON }));
		const result = await createGithub({ run }).getPull({ number: 12, owner: "swcstudiospace", repo: "plugin" });
		expect(run.calls[0]?.args).toEqual([
			"pr",
			"view",
			"12",
			"--repo",
			"swcstudiospace/plugin",
			"--json",
			"number,title,url,state,headRefName,baseRefName,mergedAt,isDraft",
		]);
		expect(result).toEqual({
			ok: true,
			pull: {
				number: 12,
				title: "Add MCP",
				htmlUrl: "https://github.com/swcstudiospace/plugin/pull/12",
				state: "OPEN",
				headRef: "feat/mcp",
				baseRef: "main",
				merged: false,
			},
		});
	});

	test("marks mergedAt as merged", async () => {
		const run = mockRun(() => ({
			stdout: JSON.stringify({
				number: 1,
				title: "Done",
				url: "https://example.test/1",
				state: "MERGED",
				headRefName: "feat",
				baseRefName: "main",
				mergedAt: "2026-01-01T00:00:00Z",
			}),
		}));
		const result = await createGithub({ run }).getPull({ number: 1, owner: "o", repo: "r" });
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.pull.merged).toBe(true);
	});
});

describe("mergePull", () => {
	test("squashes without a force flag", async () => {
		const run = mockRun(() => ({ stdout: "ok" }));
		const result = await createGithub({ run }).mergePull({ number: 9, owner: "swcstudiospace", repo: "plugin" });
		expect(run.calls[0]?.args).toEqual(["pr", "merge", "9", "--repo", "swcstudiospace/plugin", "--squash"]);
		expect(result).toEqual({ ok: true });
	});

	test("nonzero merge is ok false", async () => {
		const run = mockRun(() => ({ stderr: "required checks failed", code: 1 }));
		const result = await createGithub({ run }).mergePull({ number: 9, owner: "o", repo: "r" });
		expect(result).toEqual({ ok: false, error: "required checks failed" });
	});
});

describe("prHasGreptileReview", () => {
	test("is true when a review login includes greptile", async () => {
		const run = mockRun((_bin, args) => {
			if (args[1]?.endsWith("/comments")) return { stdout: "[]" };
			return { stdout: JSON.stringify([{ user: { login: "greptile-apps[bot]" } }]) };
		});
		const result = await createGithub({ run }).prHasGreptileReview({
			number: 12,
			owner: "swcstudiospace",
			repo: "plugin",
		});
		expect(run.calls.map((call) => call.args)).toEqual([
			["api", "repos/swcstudiospace/plugin/pulls/12/comments"],
			["api", "repos/swcstudiospace/plugin/pulls/12/reviews"],
		]);
		expect(result).toEqual({ ok: true, hasGreptileReview: true });
	});

	test("is true when a comment login includes greptile", async () => {
		const run = mockRun((_bin, args) => {
			if (args[1]?.endsWith("/comments")) {
				return { stdout: JSON.stringify([{ user: { login: "greptile-apps" } }]) };
			}
			return { stdout: "[]" };
		});
		const result = await createGithub({ run }).prHasGreptileReview({ number: 1, owner: "o", repo: "r" });
		expect(result).toEqual({ ok: true, hasGreptileReview: true });
	});

	test("is false when no greptile login is present", async () => {
		const run = mockRun(() => ({ stdout: JSON.stringify([{ user: { login: "octocat" } }]) }));
		const result = await createGithub({ run }).prHasGreptileReview({ number: 1, owner: "o", repo: "r" });
		expect(result).toEqual({ ok: true, hasGreptileReview: false });
	});
});

describe("createGithub", () => {
	test("never throws when the runner throws", async () => {
		const run = mockRun(() => {
			throw new Error("spawn failed");
		});
		const result = await createGithub({ run }).listRepos();
		expect(result).toEqual({ ok: false, error: "spawn failed" });
	});
});
