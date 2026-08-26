import {
	DEFAULT_POD_CONFIG,
	type AndaFetch,
	type AndaProbe,
	type BootPodOpts,
	type DiagnosePodOpts,
	type ConnectWorkspaceOpts,
	type ConnectWorkspaceResult,
	type DteeProbe,
	type PodConfig,
	type PodSession,
	type PodDoctor,
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

export async function diagnosePod(opts: DiagnosePodOpts): Promise<PodDoctor> {
	try {
		const version = await invokeCli(opts.run, opts.bin, ["version"]);
		let workspaces = 0;
		const list = await invokeCli(opts.run, opts.bin, ["list", "--output", "json"]);
		try {
			const parsed: unknown = JSON.parse(list.stdout);
			workspaces = Array.isArray(parsed) ? parsed.length : 0;
		} catch {
			workspaces = 0;
		}
		const status = await invokeCli(opts.run, opts.bin, ["status", opts.id, "--output", "json"]);
		const workspaceState = parseStatusState(status.stdout, opts.id);
		const anda = await probeAnda(opts.nexusUrl, opts.fetchFn);
		const dtee = await probeDtee(opts.dteeUrl, opts.fetchFn);
		return {
			bin: opts.bin,
			binOk: version.code === 0,
			enabled: opts.enabled,
			connected: opts.session?.connected ?? false,
			workspaceId: opts.id,
			...(workspaceState !== undefined ? { workspaceState } : {}),
			workspaces,
			engineActive: anda.active,
			nexusUrl: opts.nexusUrl,
			dtee: dtee.active,
			dteeUrl: opts.dteeUrl,
			extraDirs: opts.session?.extraDirs.length ?? 0,
			...(opts.session?.localFolder !== undefined ? { localFolder: opts.session.localFolder } : {}),
			...(opts.session?.reason !== undefined ? { reason: opts.session.reason } : {}),
		};
	} catch {
		return {
			bin: opts.bin,
			binOk: false,
			enabled: opts.enabled,
			connected: opts.session?.connected ?? false,
			workspaceId: opts.id,
			workspaces: 0,
			engineActive: false,
			nexusUrl: opts.nexusUrl,
			dtee: false,
			dteeUrl: opts.dteeUrl,
			extraDirs: opts.session?.extraDirs.length ?? 0,
			...(opts.session?.localFolder !== undefined ? { localFolder: opts.session.localFolder } : {}),
			...(opts.session?.reason !== undefined ? { reason: opts.session.reason } : {}),
		};
	}
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
			const anda = await probeAnda(nexusUrl, opts.fetchFn);
			const dtee = await probeDtee(dteeUrl, opts.fetchFn);
			return {
				enabled: true,
				connected: false,
				workspaceId,
				source,
				localFolder: source,
				extraDirs,
				engineActive: anda.active,
				nexusUrl: anda.nexusUrl,
				dtee: dtee.active,
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
			const anda = await probeAnda(nexusUrl, opts.fetchFn);
			const dtee = await probeDtee(dteeUrl, opts.fetchFn);
			return {
				enabled: true,
				connected: false,
				workspaceId,
				source,
				localFolder: source,
				extraDirs,
				engineActive: anda.active,
				nexusUrl: anda.nexusUrl,
				dtee: dtee.active,
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
		const anda = await probeAnda(nexusUrl, opts.fetchFn);
		const dtee = await probeDtee(dteeUrl, opts.fetchFn);
		return failedSession(opts, config, {
			workspaceId,
			nexusUrl: anda.nexusUrl,
			engineActive: anda.active,
			dtee: dtee.active,
			reason: message,
		});
	}
}
