import { describe, expect, test } from "bun:test";
import { DEFAULT_SWARM_CONFIG } from "./types.ts";
import { isSdlcPrompt, kickoffSwarm, resolveSwarmRoot } from "./kickoff.ts";

describe("kickoffSwarm", () => {
	test("classifies SDLC vs trivia", () => {
		expect(isSdlcPrompt("implement a billing feature")).toBe(true);
		expect(isSdlcPrompt("build a login page")).toBe(true);
		expect(isSdlcPrompt("what is a monad")).toBe(false);
		expect(isSdlcPrompt("/all-in-one:grok status")).toBe(false);
	});

	test("spawns autonomous_run after classify", () => {
		const spawned: string[][] = [];
		const out = kickoffSwarm({
			cwd: "/tmp/app",
			prompt: "implement a new feature in the app",
			config: { ...DEFAULT_SWARM_CONFIG, root: "/root/src/repos/agent-swarm", dryRun: true },
			spawn: (argv) => spawned.push(argv),
		});
		expect(out.kicked).toBe(true);
		expect(spawned[0]?.join(" ")).toContain("autonomous_run.py");
		expect(spawned[0]?.join(" ")).toContain("--dry-run");
		expect(spawned[0]?.join(" ")).toContain("implement a new feature");
	});

	test("forwards the uplifted spec file so A01 plans from it, keeping the original for classification", () => {
		const spawned: string[][] = [];
		const out = kickoffSwarm({
			cwd: "/tmp/app",
			prompt: "implement a new feature in the app",
			specPath: "/tmp/state/aio/sessions/s1.xml",
			config: { ...DEFAULT_SWARM_CONFIG, root: "/root/src/repos/agent-swarm", dryRun: true },
			spawn: (argv) => spawned.push(argv),
		});
		expect(out.kicked).toBe(true);
		const i = spawned[0]!.indexOf("--spec");
		expect(i).toBeGreaterThan(0);
		expect(spawned[0]![i + 1]).toBe("/tmp/state/aio/sessions/s1.xml");
		expect(spawned[0]!.join(" ")).toContain("--brief implement a new feature");
	});

	test("skips when disabled", () => {
		const spawned: string[][] = [];
		const out = kickoffSwarm({
			cwd: "/tmp",
			prompt: "implement a feature",
			config: { ...DEFAULT_SWARM_CONFIG, enabled: false },
			spawn: (argv) => spawned.push(argv),
		});
		expect(out.kicked).toBe(false);
		expect(out.reason).toBe("disabled");
		expect(spawned).toEqual([]);
	});

	test("resolveSwarmRoot prefers nested checkout", () => {
		expect(resolveSwarmRoot("/root/src/repos", "")).toBe("/root/src/repos/agent-swarm");
	});
});
