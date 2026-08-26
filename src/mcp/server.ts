import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { GithubClient, GithubFail, MergePullOk, PullNumberInput } from "./github.ts";
import type { GreptileReviewInput, GreptileWhoami } from "./greptile.ts";
import { DEFAULT_GITHUB_ORG, type GreptileReview, type MergeGate } from "./types.ts";

export interface GreptileClient {
	whoami(): Promise<GreptileWhoami>;
	review(input?: GreptileReviewInput): Promise<GreptileReview>;
	allowsMerge(review: GreptileReview): MergeGate;
}

export interface AioMcpServerDeps {
	github: GithubClient;
	greptile: GreptileClient;
	org?: string;
}

export interface MergeAfterReviewInput extends PullNumberInput {
	base?: string;
}

export interface MergeAfterReviewResult {
	ok: boolean;
	merged: boolean;
	reason: string;
	review?: GreptileReview;
}

function text(value: unknown): { content: Array<{ type: "text"; text: string }> } {
	return {
		content: [
			{
				type: "text",
				text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
			},
		],
	};
}

export async function mergeAfterReview(
	github: Pick<GithubClient, "mergePull">,
	greptile: Pick<GreptileClient, "review" | "allowsMerge">,
	input: MergeAfterReviewInput,
): Promise<MergeAfterReviewResult> {
	const review = await greptile.review({ cwd: process.cwd(), base: input.base });
	const gate = greptile.allowsMerge(review);
	if (!gate.ok) {
		return { ok: false, merged: false, reason: gate.reason, review };
	}
	const merged: MergePullOk | GithubFail = await github.mergePull({
		number: input.number,
		owner: input.owner,
		repo: input.repo,
	});
	if (!merged.ok) {
		return { ok: false, merged: false, reason: merged.error, review };
	}
	return { ok: true, merged: true, reason: gate.reason, review };
}

export function createAioMcpServer(deps: AioMcpServerDeps): McpServer {
	const github = deps.github;
	const greptile = deps.greptile;
	const org = deps.org ?? DEFAULT_GITHUB_ORG;

	const server = new McpServer(
		{
			name: "aio",
			version: "0.1.0",
			title: "All-in-one GitHub + Greptile",
		},
		{
			instructions:
				"GitHub org swcstudiospace plus Greptile review. Merge is refused until greptile.review then allowsMerge is ok. No force-merge tool.",
		},
	);

	server.registerTool(
		"aio_status",
		{
			description: "Org and Greptile signed-in status. Never includes tokens.",
			inputSchema: {},
		},
		async () => {
			const who = await greptile.whoami();
			return text({ org, greptile: { signedIn: who.signedIn } });
		},
	);

	server.registerTool(
		"github_list_repos",
		{
			description: "List repositories in a GitHub org.",
			inputSchema: {
				org: z.string().optional().describe("GitHub org (defaults to configured org)"),
			},
		},
		async (args: { org?: string }) => text(await github.listRepos(args?.org)),
	);

	server.registerTool(
		"github_create_repo",
		{
			description: "Create a repository in the configured GitHub org.",
			inputSchema: {
				name: z.string().describe("Repository name"),
				private: z.boolean().optional().describe("Create as private"),
			},
		},
		async (args: { name: string; private?: boolean }) =>
			text(await github.createRepo(args.name, { private: args.private })),
	);

	server.registerTool(
		"github_create_pull_request",
		{
			description: "Open a pull request. owner/repo default to the current gh repo.",
			inputSchema: {
				title: z.string().describe("Pull request title"),
				body: z.string().optional().describe("Pull request body"),
				base: z.string().optional().describe("Base branch"),
				owner: z.string().optional().describe("Repo owner"),
				repo: z.string().optional().describe("Repo name"),
			},
		},
		async (args: { title: string; body?: string; base?: string; owner?: string; repo?: string }) =>
			text(
				await github.createPull({
					title: args.title,
					body: args.body,
					base: args.base,
					owner: args.owner,
					repo: args.repo,
				}),
			),
	);

	server.registerTool(
		"github_list_pull_requests",
		{
			description: "List pull requests for a repo.",
			inputSchema: {
				owner: z.string().optional().describe("Repo owner"),
				repo: z.string().optional().describe("Repo name"),
				state: z.string().optional().describe("PR state filter"),
			},
		},
		async (args: { owner?: string; repo?: string; state?: string }) =>
			text(await github.listPulls({ owner: args?.owner, repo: args?.repo, state: args?.state })),
	);

	server.registerTool(
		"github_get_pull_request",
		{
			description: "Get one pull request by number.",
			inputSchema: {
				number: z.number().int().describe("Pull request number"),
				owner: z.string().optional().describe("Repo owner"),
				repo: z.string().optional().describe("Repo name"),
			},
		},
		async (args: { number: number; owner?: string; repo?: string }) =>
			text(await github.getPull({ number: args.number, owner: args.owner, repo: args.repo })),
	);

	server.registerTool(
		"greptile_whoami",
		{
			description: "Greptile CLI identity. Signed-out is a normal result.",
			inputSchema: {},
		},
		async () => {
			const who = await greptile.whoami();
			return text({ ok: who.ok, signedIn: who.signedIn });
		},
	);

	server.registerTool(
		"greptile_review",
		{
			description: "Run greptile review --json in the current working directory.",
			inputSchema: {
				base: z.string().optional().describe("Optional review base branch"),
			},
		},
		async (args: { base?: string }) => text(await greptile.review({ cwd: process.cwd(), base: args?.base })),
	);

	server.registerTool(
		"github_merge_pull_request",
		{
			description: "Merge a PR only after greptile.review then allowsMerge. No force flag.",
			inputSchema: {
				number: z.number().int().describe("Pull request number"),
				owner: z.string().optional().describe("Repo owner"),
				repo: z.string().optional().describe("Repo name"),
			},
		},
		async (args: { number: number; owner?: string; repo?: string }) =>
			text(await mergeAfterReview(github, greptile, args)),
	);

	return server;
}
