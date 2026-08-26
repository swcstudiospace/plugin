import type { CliRunner } from "../mcp/types.ts";

export interface PodConfig {
	enabled: boolean;
	bin: string;
	workspaceId: string;
	extraDirs: string[];
	nexusUrl: string;
}

export const DEFAULT_POD_CONFIG: PodConfig = {
	enabled: false,
	bin: "devpod",
	workspaceId: "",
	extraDirs: [],
	nexusUrl: "http://127.0.0.1:8091",
};

export interface UpWorkspaceOpts {
	run: CliRunner;
	bin: string;
	source: string;
	id: string;
}

export interface UpWorkspaceResult {
	ok: boolean;
	stdout: string;
	stderr: string;
	code: number;
}

export interface AndaFetch {
	(url: string, init?: { signal?: AbortSignal }): Promise<{ ok: boolean; status: number }>;
}

export interface AndaProbe {
	active: boolean;
	nexusUrl: string;
}

export interface ConnectWorkspaceOpts {
	run: CliRunner;
	bin: string;
	id: string;
	nexusUrl: string;
	fetchFn?: AndaFetch;
}

export interface ConnectWorkspaceResult {
	engineActive: boolean;
	nexusUrl: string;
	localFolder?: string;
	dtee: false;
}

export interface WrapBashOpts {
	bin: string;
	id: string;
}

export interface BootPodOpts {
	run: CliRunner;
	cwd: string;
	config?: Partial<PodConfig>;
	fetchFn?: AndaFetch;
	env?: Record<string, string | undefined>;
}

export interface PodSession {
	enabled: boolean;
	connected: boolean;
	workspaceId: string;
	source: string;
	localFolder: string;
	extraDirs: string[];
	engineActive: boolean;
	nexusUrl: string;
	dtee: false;
	reason?: string;
}
