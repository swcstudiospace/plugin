export const DEFAULT_GITHUB_ORG = "swcstudiospace";

export interface GithubConfig {
	org: string;
	autoPr: boolean;
}

export interface GreptileConfig {
	requiredForMerge: boolean;
	bin: string;
	minConfidence: number;
}

export interface CliResult {
	stdout: string;
	stderr: string;
	code: number;
}

export type CliRunner = (bin: string, args: string[], cwd?: string) => Promise<CliResult>;

export interface GithubRepo {
	name: string;
	fullName: string;
	htmlUrl: string;
	private: boolean;
	defaultBranch: string;
}

export interface GithubPull {
	number: number;
	title: string;
	htmlUrl: string;
	state: string;
	headRef: string;
	baseRef: string;
	merged: boolean;
}

export interface GreptileReview {
	confidence: number;
	comments: Array<{ path?: string; body?: string; securityIssue?: boolean; severity?: string }>;
	signedIn: boolean;
	raw?: unknown;
}

export interface MergeGate {
	ok: boolean;
	reason: string;
	review?: GreptileReview;
}
