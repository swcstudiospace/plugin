import type { CliResult, CliRunner, GithubPull, GithubRepo } from "./types.ts";
import { DEFAULT_GITHUB_ORG } from "./types.ts";

export interface GithubFail {
	ok: false;
	error: string;
}

export interface CurrentRepoOk {
	ok: true;
	owner: string;
	repo: string;
	nameWithOwner: string;
	defaultBranch: string;
}

export interface ListReposOk {
	ok: true;
	repos: GithubRepo[];
}

export interface CreateRepoOk {
	ok: true;
	repo: GithubRepo;
}

export interface CreatePullOk {
	ok: true;
	htmlUrl: string;
}

export interface ListPullsOk {
	ok: true;
	pulls: GithubPull[];
}

export interface GetPullOk {
	ok: true;
	pull: GithubPull;
}

export interface MergePullOk {
	ok: true;
}

export interface PrHasGreptileReviewOk {
	ok: true;
	hasGreptileReview: boolean;
}

export interface CreatePullInput {
	title: string;
	body?: string;
	base?: string;
	owner?: string;
	repo?: string;
	cwd?: string;
}

export interface RepoRefInput {
	owner?: string;
	repo?: string;
	state?: string;
}

export interface PullNumberInput {
	number: number;
	owner?: string;
	repo?: string;
}

export interface GithubClient {
	currentRepo(cwd?: string): Promise<CurrentRepoOk | GithubFail>;
	listRepos(org?: string): Promise<ListReposOk | GithubFail>;
	createRepo(name: string, opts?: { private?: boolean; org?: string }): Promise<CreateRepoOk | GithubFail>;
	createPull(input: CreatePullInput): Promise<CreatePullOk | GithubFail>;
	listPulls(input?: RepoRefInput): Promise<ListPullsOk | GithubFail>;
	getPull(input: PullNumberInput): Promise<GetPullOk | GithubFail>;
	mergePull(input: PullNumberInput): Promise<MergePullOk | GithubFail>;
	prHasGreptileReview(input: PullNumberInput): Promise<PrHasGreptileReviewOk | GithubFail>;
}

const REPO_LIST_JSON = "name,nameWithOwner,url,isPrivate,defaultBranchRef";
const PR_LIST_JSON = "number,title,url,state,headRefName,baseRefName,mergedAt";
const PR_VIEW_JSON = "number,title,url,state,headRefName,baseRefName,mergedAt,isDraft";

function fail(error: string): GithubFail {
	return { ok: false, error };
}

function errorText(result: CliResult, fallback: string): string {
	const stderr = result.stderr.trim();
	if (stderr) return stderr;
	const stdout = result.stdout.trim();
	if (stdout) return stdout;
	return fallback;
}

async function invoke(
	run: CliRunner,
	args: string[],
	cwd?: string,
): Promise<{ ok: true; stdout: string } | GithubFail> {
	try {
		const result = await run("gh", args, cwd);
		if (result.code !== 0) {
			return fail(errorText(result, `gh ${args.join(" ")} failed`));
		}
		return { ok: true, stdout: result.stdout };
	} catch (error) {
		return fail(error instanceof Error ? error.message : String(error));
	}
}

function parseJson(text: string): { ok: true; value: unknown } | GithubFail {
	try {
		return { ok: true, value: JSON.parse(text) };
	} catch {
		return fail("invalid JSON");
	}
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

function parseNameWithOwner(value: unknown): { owner: string; repo: string } | undefined {
	if (typeof value !== "string") return undefined;
	const [owner, repo, extra] = value.split("/");
	if (!owner || !repo || extra !== undefined) return undefined;
	return { owner, repo };
}

function defaultBranchName(ref: unknown): string {
	if (typeof ref === "string") return ref;
	const record = asRecord(ref);
	return typeof record?.name === "string" ? record.name : "";
}

function mapRepo(raw: Record<string, unknown>): GithubRepo {
	return {
		name: typeof raw.name === "string" ? raw.name : "",
		fullName: typeof raw.nameWithOwner === "string" ? raw.nameWithOwner : "",
		htmlUrl: typeof raw.url === "string" ? raw.url : "",
		private: Boolean(raw.isPrivate),
		defaultBranch: defaultBranchName(raw.defaultBranchRef),
	};
}

function mapPull(raw: Record<string, unknown>): GithubPull {
	return {
		number: Number(raw.number) || 0,
		title: typeof raw.title === "string" ? raw.title : "",
		htmlUrl: typeof raw.url === "string" ? raw.url : "",
		state: typeof raw.state === "string" ? raw.state : "",
		headRef: typeof raw.headRefName === "string" ? raw.headRefName : "",
		baseRef: typeof raw.baseRefName === "string" ? raw.baseRefName : "",
		merged: Boolean(raw.mergedAt),
	};
}

function loginHasGreptile(item: unknown): boolean {
	const record = asRecord(item);
	const user = asRecord(record?.user);
	const login = user?.login;
	return typeof login === "string" && login.toLowerCase().includes("greptile");
}

function anyLoginHasGreptile(value: unknown): boolean {
	if (!Array.isArray(value)) return false;
	return value.some(loginHasGreptile);
}

export function createGithub(opts: { run: CliRunner; org?: string }): GithubClient {
	const run = opts.run;
	const defaultOrg = opts.org ?? DEFAULT_GITHUB_ORG;

	async function currentRepo(cwd?: string): Promise<CurrentRepoOk | GithubFail> {
		const invoked = await invoke(run, ["repo", "view", "--json", "nameWithOwner,defaultBranchRef"], cwd);
		if (!invoked.ok) return invoked;
		const parsed = parseJson(invoked.stdout);
		if (!parsed.ok) return parsed;
		const record = asRecord(parsed.value);
		const parsedName = parseNameWithOwner(record?.nameWithOwner);
		if (!parsedName) return fail("unable to parse nameWithOwner");
		return {
			ok: true,
			owner: parsedName.owner,
			repo: parsedName.repo,
			nameWithOwner: `${parsedName.owner}/${parsedName.repo}`,
			defaultBranch: defaultBranchName(record?.defaultBranchRef),
		};
	}

	async function resolveOwnerRepo(
		owner?: string,
		repo?: string,
		cwd?: string,
	): Promise<{ ok: true; owner: string; repo: string } | GithubFail> {
		if (owner && repo) return { ok: true, owner, repo };
		const current = await currentRepo(cwd);
		if (!current.ok) return current;
		const resolvedOwner = owner ?? current.owner;
		const resolvedRepo = repo ?? current.repo;
		if (!resolvedOwner || !resolvedRepo) return fail("unable to resolve owner/repo");
		return { ok: true, owner: resolvedOwner, repo: resolvedRepo };
	}

	return {
		currentRepo,

		async listRepos(org?: string): Promise<ListReposOk | GithubFail> {
			const targetOrg = org ?? defaultOrg;
			const invoked = await invoke(run, ["repo", "list", targetOrg, "--limit", "100", "--json", REPO_LIST_JSON]);
			if (!invoked.ok) return invoked;
			const parsed = parseJson(invoked.stdout);
			if (!parsed.ok) return parsed;
			if (!Array.isArray(parsed.value)) return fail("expected a JSON array");
			const repos: GithubRepo[] = [];
			for (const item of parsed.value) {
				const record = asRecord(item);
				if (record) repos.push(mapRepo(record));
			}
			return { ok: true, repos };
		},

		async createRepo(name: string, createOpts?: { private?: boolean; org?: string }): Promise<CreateRepoOk | GithubFail> {
			const org = createOpts?.org ?? defaultOrg;
			if (!name) return fail("repository name is required");
			const visibility = createOpts?.private ? "--private" : "--public";
			const fullName = `${org}/${name}`;
			const invoked = await invoke(run, ["repo", "create", fullName, visibility, "--clone=false", "--confirm"]);
			if (!invoked.ok) return invoked;
			const htmlUrl = invoked.stdout.trim() || `https://github.com/${fullName}`;
			return {
				ok: true,
				repo: {
					name,
					fullName,
					htmlUrl,
					private: Boolean(createOpts?.private),
					defaultBranch: "",
				},
			};
		},

		async createPull(input: CreatePullInput): Promise<CreatePullOk | GithubFail> {
			const resolved = await resolveOwnerRepo(input.owner, input.repo, input.cwd);
			if (!resolved.ok) return resolved;
			const args = [
				"pr",
				"create",
				"--repo",
				`${resolved.owner}/${resolved.repo}`,
				"--title",
				input.title,
				"--body",
				input.body ?? "",
				"--fill=false",
			];
			if (input.base) args.push("--base", input.base);
			const invoked = await invoke(run, args, input.cwd);
			if (!invoked.ok) return invoked;
			return { ok: true, htmlUrl: invoked.stdout.trim() };
		},

		async listPulls(input?: RepoRefInput): Promise<ListPullsOk | GithubFail> {
			const resolved = await resolveOwnerRepo(input?.owner, input?.repo);
			if (!resolved.ok) return resolved;
			const args = ["pr", "list", "--repo", `${resolved.owner}/${resolved.repo}`, "--json", PR_LIST_JSON];
			if (input?.state) args.push("--state", input.state);
			const invoked = await invoke(run, args);
			if (!invoked.ok) return invoked;
			const parsed = parseJson(invoked.stdout);
			if (!parsed.ok) return parsed;
			if (!Array.isArray(parsed.value)) return fail("expected a JSON array");
			const pulls: GithubPull[] = [];
			for (const item of parsed.value) {
				const record = asRecord(item);
				if (record) pulls.push(mapPull(record));
			}
			return { ok: true, pulls };
		},

		async getPull(input: PullNumberInput): Promise<GetPullOk | GithubFail> {
			const resolved = await resolveOwnerRepo(input.owner, input.repo);
			if (!resolved.ok) return resolved;
			const invoked = await invoke(run, [
				"pr",
				"view",
				String(input.number),
				"--repo",
				`${resolved.owner}/${resolved.repo}`,
				"--json",
				PR_VIEW_JSON,
			]);
			if (!invoked.ok) return invoked;
			const parsed = parseJson(invoked.stdout);
			if (!parsed.ok) return parsed;
			const record = asRecord(parsed.value);
			if (!record) return fail("expected a JSON object");
			return { ok: true, pull: mapPull(record) };
		},

		async mergePull(input: PullNumberInput): Promise<MergePullOk | GithubFail> {
			const resolved = await resolveOwnerRepo(input.owner, input.repo);
			if (!resolved.ok) return resolved;
			const invoked = await invoke(run, [
				"pr",
				"merge",
				String(input.number),
				"--repo",
				`${resolved.owner}/${resolved.repo}`,
				"--squash",
			]);
			if (!invoked.ok) return invoked;
			return { ok: true };
		},

		async prHasGreptileReview(input: PullNumberInput): Promise<PrHasGreptileReviewOk | GithubFail> {
			const resolved = await resolveOwnerRepo(input.owner, input.repo);
			if (!resolved.ok) return resolved;
			const base = `repos/${resolved.owner}/${resolved.repo}/pulls/${input.number}`;
			const commentsInvoked = await invoke(run, ["api", `${base}/comments`]);
			if (!commentsInvoked.ok) return commentsInvoked;
			const reviewsInvoked = await invoke(run, ["api", `${base}/reviews`]);
			if (!reviewsInvoked.ok) return reviewsInvoked;
			const comments = parseJson(commentsInvoked.stdout);
			if (!comments.ok) return comments;
			const reviews = parseJson(reviewsInvoked.stdout);
			if (!reviews.ok) return reviews;
			return {
				ok: true,
				hasGreptileReview: anyLoginHasGreptile(comments.value) || anyLoginHasGreptile(reviews.value),
			};
		},
	};
}
