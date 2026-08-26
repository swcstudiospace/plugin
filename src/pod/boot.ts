import {
	DEFAULT_POD_CONFIG,
	type AndaFetch,
	type AndaProbe,
	type BootPodOpts,
	type ConnectWorkspaceOpts,
	type ConnectWorkspaceResult,
	type DteeProbe,
	type PodConfig,
	type PodSession,
	type UpWorkspaceOpts,
	type UpWorkspaceResult,
	type WaitUntilReadyOpts,
	type WaitUntilReadyResult,
} from "./types.ts";
import { invokeCli } from "./run.ts";
import { ensureExtraDirs, parseLocalFolder, parseStatusState, upArgs, workspaceIdFor } from "./workspace.ts";

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

export async function probeDtee(url: string, fetchFn?: AndaFetch): Promise<DteeProbe> {
	const fetchImpl = fetchFn ?? ((href: string, init?: { signal?: AbortSignal }) => globalThis.fetch(href, init));
	try {
		const res = await fetchImpl(url, { signal: AbortSignal.timeout(PROBE_MS) });
		return { active: Boolean(res.ok), dteeUrl: url };
	} catch {
		return { active: false, dteeUrl: url };
	}
}

export async function waitUntilReady(opts: WaitUntilReadyOpts): Promise<WaitUntilReadyResult> {
	const sleep = opts.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
	const now = opts.now ?? Date.now;
	const deadline = now() + opts.timeoutMs;

	let state: string | undefined;
	while (now() < deadline) {
		const status = await invokeCli(opts.run, opts.bin, ["status", opts.id, "--output", "json"]);
		state = parseStatusState(status.stdout, opts.id);
		if (state === "Running") break;
		if (now() >= deadline) break;
		await sleep(opts.pollMs);
	}
	if (state !== "Running") {
		return { ready: false, reason: "not ready" };
	}

	while (now() < deadline) {
		const ssh = await invokeCli(opts.run, opts.bin, ["ssh", opts.id, "--command", "true"]);
		if (ssh.code === 0) return { ready: true };
		if (now() >= deadline) break;
		await sleep(opts.pollMs);
	}
	return { ready: false, reason: "not ready" };
}

export async function connectWorkspace(opts: ConnectWorkspaceOpts): Promise<ConnectWorkspaceResult> {
	const probe = await probeAnda(opts.nexusUrl, opts.fetchFn);
	const dtee = await probeDtee(opts.dteeUrl, opts.fetchFn);
	const list = await invokeCli(opts.run, opts.bin, ["list", "--output", "json"]);
	const localFolder = parseLocalFolder(list.stdout, opts.id);
	return {
		engineActive: probe.active,
		nexusUrl: probe.nexusUrl,
		...(localFolder !== undefined ? { localFolder } : {}),
		dtee: dtee.active,
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
	const dteeUrl = env.DTEE_GATEWAY_URL || env.IC_TEE_GATEWAY_URL || config.dteeUrl || DEFAULT_POD_CONFIG.dteeUrl;
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

		opts.onProgress?.("waiting for codespace…");
		const ready = await waitUntilReady({
			run: opts.run,
			bin,
			id: workspaceId,
			timeoutMs: config.readyTimeoutMs,
			pollMs: config.pollMs,
			sleep: opts.sleep,
			now: opts.now,
		});
		if (!ready.ready) {
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
				reason: ready.reason || "not ready",
			};
		}

		const conn = await connectWorkspace({
			run: opts.run,
			bin,
			id: workspaceId,
			nexusUrl,
			dteeUrl,
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
			dtee: conn.dtee,
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return failedSession(opts, config, { workspaceId, nexusUrl, reason: message });
	}
}
