import { describe, expect, test } from "bun:test";
import type { GithubFail, MergePullOk, PullNumberInput } from "./github.ts";
import { createAioMcpServer, mergeAfterReview } from "./server.ts";
import type { GreptileReview } from "./types.ts";

function cleanReview(): GreptileReview {
	return { signedIn: true, confidence: 5, comments: [] };
}

describe("mergeAfterReview", () => {
	test("refuses when the Greptile gate fails and does not merge", async () => {
		const calls: PullNumberInput[] = [];
		const review: GreptileReview = { signedIn: false, confidence: 0, comments: [] };
		const result = await mergeAfterReview(
			{
				mergePull: async (input) => {
					calls.push(input);
					return { ok: true };
				},
			},
			{
				review: async () => review,
				allowsMerge: (seen) => ({
					ok: false,
					reason: "greptile not signed in — run greptile login",
					review: seen,
				}),
			},
			{ number: 7, owner: "swcstudiospace", repo: "plugin" },
		);
		expect(calls).toEqual([]);
		expect(result).toEqual({
			ok: false,
			merged: false,
			reason: "greptile not signed in — run greptile login",
			review,
		});
	});

	test("merges only after review then allowsMerge ok", async () => {
		const order: string[] = [];
		const calls: PullNumberInput[] = [];
		const review = cleanReview();
		const result = await mergeAfterReview(
			{
				mergePull: async (input) => {
					order.push("merge");
					calls.push(input);
					return { ok: true };
				},
			},
			{
				review: async () => {
					order.push("review");
					return review;
				},
				allowsMerge: (seen) => {
					order.push("gate");
					return { ok: true, reason: "review clean", review: seen };
				},
			},
			{ number: 12, owner: "swcstudiospace", repo: "plugin" },
		);
		expect(order).toEqual(["review", "gate", "merge"]);
		expect(calls).toEqual([{ number: 12, owner: "swcstudiospace", repo: "plugin" }]);
		expect(result).toEqual({
			ok: true,
			merged: true,
			reason: "review clean",
			review,
		});
	});

	test("does not claim merge when github.mergePull fails after a clean gate", async () => {
		const review = cleanReview();
		const result = await mergeAfterReview(
			{
				mergePull: async (): Promise<MergePullOk | GithubFail> => ({
					ok: false,
					error: "required checks failed",
				}),
			},
			{
				review: async () => review,
				allowsMerge: (seen) => ({ ok: true, reason: "review clean", review: seen }),
			},
			{ number: 3 },
		);
		expect(result).toEqual({
			ok: false,
			merged: false,
			reason: "required checks failed",
			review,
		});
	});
});

describe("createAioMcpServer", () => {
	test("constructs with injected github and greptile", () => {
		const server = createAioMcpServer({
			org: "swcstudiospace",
			github: {
				currentRepo: async () => ({
					ok: true,
					owner: "swcstudiospace",
					repo: "plugin",
					nameWithOwner: "swcstudiospace/plugin",
					defaultBranch: "main",
				}),
				listRepos: async () => ({ ok: true, repos: [] }),
				createRepo: async () => ({
					ok: true,
					repo: {
						name: "x",
						fullName: "swcstudiospace/x",
						htmlUrl: "https://github.com/swcstudiospace/x",
						private: true,
						defaultBranch: "main",
					},
				}),
				createPull: async () => ({ ok: true, htmlUrl: "https://github.com/swcstudiospace/plugin/pull/1" }),
				listPulls: async () => ({ ok: true, pulls: [] }),
				getPull: async () => ({
					ok: true,
					pull: {
						number: 1,
						title: "t",
						htmlUrl: "https://github.com/swcstudiospace/plugin/pull/1",
						state: "OPEN",
						headRef: "feat",
						baseRef: "main",
						merged: false,
					},
				}),
				mergePull: async () => ({ ok: true }),
				prHasGreptileReview: async () => ({ ok: true, hasGreptileReview: true }),
			},
			greptile: {
				whoami: async () => ({ ok: true, signedIn: false, text: "Not signed in" }),
				review: async () => ({ confidence: 0, comments: [], signedIn: false }),
				allowsMerge: (review) => ({
					ok: false,
					reason: "greptile not signed in — run greptile login",
					review,
				}),
			},
		});
		expect(server).toBeDefined();
	});
});
