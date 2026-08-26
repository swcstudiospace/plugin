import { describe, expect, test } from "bun:test";
import { parseGitRemote, resolveGithub } from "./github.ts";

describe("parseGitRemote", () => {
	test("parses git@github.com SSH remotes into canonical https", () => {
		expect(parseGitRemote("git@github.com:acme/app.git")).toEqual({
			slug: "acme/app",
			remoteUrl: "https://github.com/acme/app",
		});
	});

	test("parses https github remotes and strips .git", () => {
		expect(parseGitRemote("https://github.com/acme/app.git")).toEqual({
			slug: "acme/app",
			remoteUrl: "https://github.com/acme/app",
		});
	});

	test("parses https github remotes without .git", () => {
		expect(parseGitRemote("https://github.com/acme/app")).toEqual({
			slug: "acme/app",
			remoteUrl: "https://github.com/acme/app",
		});
	});

	test("keeps the original URL for non-github remotes", () => {
		expect(parseGitRemote("git@gitlab.com:acme/app.git")).toEqual({
			slug: "acme/app",
			remoteUrl: "git@gitlab.com:acme/app.git",
		});
		expect(parseGitRemote("https://gitlab.com/acme/app.git")).toEqual({
			slug: "acme/app",
			remoteUrl: "https://gitlab.com/acme/app.git",
		});
	});

	test("returns undefined for empty or unparseable remotes", () => {
		expect(parseGitRemote("")).toBeUndefined();
		expect(parseGitRemote("   ")).toBeUndefined();
		expect(parseGitRemote("not-a-remote")).toBeUndefined();
		expect(parseGitRemote("https://github.com/only-owner")).toBeUndefined();
	});

	test("trims surrounding whitespace", () => {
		expect(parseGitRemote("  git@github.com:acme/app.git\n")).toEqual({
			slug: "acme/app",
			remoteUrl: "https://github.com/acme/app",
		});
	});
});

describe("resolveGithub", () => {
	test("parses origin from the injected runner", () => {
		expect(
			resolveGithub("/repo", () => ({
				stdout: "git@github.com:acme/app.git\n",
				code: 0,
			})),
		).toEqual({
			slug: "acme/app",
			remoteUrl: "https://github.com/acme/app",
		});
	});

	test("asks git for origin in the given root", () => {
		let cwd: string | undefined;
		let cmd: string[] | undefined;
		resolveGithub("/work/app", (passedCmd, passedCwd) => {
			cmd = passedCmd;
			cwd = passedCwd;
			return { stdout: "https://github.com/acme/app.git", code: 0 };
		});
		expect(cmd).toEqual(["git", "remote", "get-url", "origin"]);
		expect(cwd).toBe("/work/app");
	});

	test("ignores nonzero git exits", () => {
		expect(resolveGithub("/repo", () => ({ stdout: "", code: 1 }))).toBeUndefined();
	});

	test("ignores runner throws", () => {
		expect(
			resolveGithub("/repo", () => {
				throw new Error("no git");
			}),
		).toBeUndefined();
	});
});
