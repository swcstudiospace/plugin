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
