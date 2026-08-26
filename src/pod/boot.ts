import {
	DEFAULT_POD_CONFIG,
	type AndaFetch,
	type AndaProbe,
	type BootPodOpts,
	type ConnectWorkspaceOpts,
	type ConnectWorkspaceResult,
	type PodConfig,
	type PodSession,
	type UpWorkspaceOpts,
	type UpWorkspaceResult,
} from "./types.ts";
import { invokeCli } from "./run.ts";
import { ensureExtraDirs, parseLocalFolder, upArgs, workspaceIdFor } from "./workspace.ts";

const PROBE_MS = 2000;

export async function upWorkspace(opts: UpWorkspaceOpts): Promise<UpWorkspaceResult> {
	const result = await invokeCli(opts.run, opts.bin, ["up", ...upArgs(opts.source, opts.id)], opts.source);
	return {
		ok: result.code === 0,
		stdout: result.stdout,
		stderr: result.stderr,
		code: result.code,
	};
}

export async function probeAnda(url: string, fetchFn?: AndaFetch): Promise<AndaProbe> {
	const fetchImpl = fetchFn ?? ((href: string, init?: { signal?: AbortSignal }) => globalThis.fetch(href, init));
	try {
		const res = await fetchImpl(url, { signal: AbortSignal.timeout(PROBE_MS) });
		return { active: Boolean(res.ok), nexusUrl: url };
	} catch {
		return { active: false, nexusUrl: url };
	}
}

export async function connectWorkspace(opts: ConnectWorkspaceOpts): Promise<ConnectWorkspaceResult> {
	const probe = await probeAnda(opts.nexusUrl, opts.fetchFn);
	const list = await invokeCli(opts.run, opts.bin, ["list", "--output", "json"]);
	const localFolder = parseLocalFolder(list.stdout, opts.id);
	return {
		engineActive: probe.active,
		nexusUrl: probe.nexusUrl,
		...(localFolder !== undefined ? { localFolder } : {}),
		dtee: false,
	};
}

function failedSession(
	opts: BootPodOpts,
	config: PodConfig,
	partial: Partial<PodSession> & { reason: string },
): PodSession {
	return {
		enabled: config.enabled,
		connected: false,
		workspaceId: config.workspaceId || workspaceIdFor(opts.cwd),
		source: opts.cwd,
		localFolder: opts.cwd,
		extraDirs: [],
		engineActive: false,
		nexusUrl: config.nexusUrl || DEFAULT_POD_CONFIG.nexusUrl,
		dtee: false,
		...partial,
	};
}

export async function bootPod(opts: BootPodOpts): Promise<PodSession> {
	const env = opts.env ?? process.env;
	const config: PodConfig = { ...DEFAULT_POD_CONFIG, ...opts.config };
	const bin = env.AIMEE_POD_BIN || config.bin || DEFAULT_POD_CONFIG.bin;
	const nexusUrl = env.ANDA_NEXUS_URL || config.nexusUrl || DEFAULT_POD_CONFIG.nexusUrl;
	const workspaceId = config.workspaceId || workspaceIdFor(opts.cwd);
	const source = opts.cwd;

	if (env.PI_AIO_CHILD || env.PI_ULTRATHINK_CHILD) {
		return failedSession(opts, config, { workspaceId, nexusUrl, reason: "child session" });
	}
	if (!config.enabled) {
		return failedSession(opts, config, { workspaceId, nexusUrl, reason: "disabled" });
	}

	try {
		const extraDirs = ensureExtraDirs(opts.cwd, config.extraDirs);
		const up = await upWorkspace({ run: opts.run, bin, source, id: workspaceId });
		if (up.code !== 0) {
			return {
				enabled: true,
				connected: false,
				workspaceId,
				source,
				localFolder: source,
				extraDirs,
				engineActive: false,
				nexusUrl,
				dtee: false,
				reason: up.stderr.trim() || `up exited ${up.code}`,
			};
		}

		const conn = await connectWorkspace({
			run: opts.run,
			bin,
			id: workspaceId,
			nexusUrl,
			fetchFn: opts.fetchFn,
		});

		return {
			enabled: true,
			connected: true,
			workspaceId,
			source,
			localFolder: conn.localFolder || source,
			extraDirs,
			engineActive: conn.engineActive,
			nexusUrl: conn.nexusUrl,
			dtee: false,
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return failedSession(opts, config, { workspaceId, nexusUrl, reason: message });
	}
}
