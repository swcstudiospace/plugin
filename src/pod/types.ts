import type { CliRunner } from "../mcp/types.ts";

export interface PodConfig {
	enabled: boolean;
	bin: string;
	workspaceId: string;
	extraDirs: string[];
	nexusUrl: string;
	readyTimeoutMs: number;
	pollMs: number;
	dteeUrl: string;
}

export const DEFAULT_POD_CONFIG: PodConfig = {
	enabled: false,
	bin: "devpod",
	workspaceId: "",
	extraDirs: [],
	nexusUrl: "http://127.0.0.1:8091",
	readyTimeoutMs: 300000,
	pollMs: 2000,
	dteeUrl: "http://127.0.0.1:8443",
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
	dteeUrl: string;
	fetchFn?: AndaFetch;
}

export interface ConnectWorkspaceResult {
	engineActive: boolean;
	nexusUrl: string;
	localFolder?: string;
	dtee: boolean;
}

export interface WrapBashOpts {
	bin: string;
	id: string;
}

export interface WaitUntilReadyOpts {
	run: CliRunner;
	bin: string;
	id: string;
	timeoutMs: number;
	pollMs: number;
	sleep?: (ms: number) => Promise<void>;
	now?: () => number;
}

export interface WaitUntilReadyResult {
	ready: boolean;
	reason?: string;
}

export interface DteeProbe {
	active: boolean;
	dteeUrl: string;
}

export interface BootPodOpts {
	run: CliRunner;
	cwd: string;
	config?: Partial<PodConfig>;
	fetchFn?: AndaFetch;
	env?: Record<string, string | undefined>;
	sleep?: (ms: number) => Promise<void>;
	now?: () => number;
	onProgress?: (msg: string) => void;
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
	dtee: boolean;
	reason?: string;
}
