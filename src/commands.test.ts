import { describe, expect, test } from "bun:test";
import type { UpliftState } from "./types.ts";
import { applyCommand, formatStatus, formatUpliftEcho, parseAioArgs } from "./commands.ts";

function state(init?: Partial<UpliftState>): UpliftState {
	return { enabled: true, skipOnce: false, skipTrivial: true, ...init };
}

describe("parseAioArgs", () => {
	test("empty args is toggle", () => {
		expect(parseAioArgs("")).toEqual({ cmd: "toggle", rest: "" });
		expect(parseAioArgs("   ")).toEqual({ cmd: "toggle", rest: "" });
	});

	test("off is off", () => {
		expect(parseAioArgs("off")).toEqual({ cmd: "off", rest: "" });
	});

	test("aio uplift off strips the leading uplift token", () => {
		expect(parseAioArgs("uplift off")).toEqual({ cmd: "off", rest: "" });
		expect(parseAioArgs("UPLIFT OFF")).toEqual({ cmd: "off", rest: "" });
		expect(parseAioArgs("uplift")).toEqual({ cmd: "toggle", rest: "" });
		expect(parseAioArgs("uplift last extra")).toEqual({ cmd: "last", rest: "extra" });
	});
});

describe("applyCommand", () => {
	test("toggle flips enabled", () => {
		const on = state({ enabled: true });
		expect(applyCommand(on, "toggle").message).toBe("Prompt Uplift off");
		expect(on.enabled).toBe(false);
		expect(applyCommand(on, "").message).toBe("Prompt Uplift on");
		expect(on.enabled).toBe(true);
	});

	test("on enables", () => {
		const s = state({ enabled: false });
		const result = applyCommand(s, "on");
		expect(s.enabled).toBe(true);
		expect(result.message).toBe("Prompt Uplift on");
		expect(result.showLast).toBeUndefined();
	});

	test("off disables", () => {
		const s = state({ enabled: true });
		const result = applyCommand(s, "off");
		expect(s.enabled).toBe(false);
		expect(result.message).toBe("Prompt Uplift off");
	});

	test("skip sets skipOnce without changing enabled", () => {
		const s = state({ enabled: true });
		const result = applyCommand(s, "skip");
		expect(s.skipOnce).toBe(true);
		expect(s.enabled).toBe(true);
		expect(result.message).toContain("skip");
	});

	test("status reports mode and skip next", () => {
		const s = state({ enabled: true, skipOnce: true });
		expect(applyCommand(s, "status").message).toBe(formatStatus(s));
		expect(formatStatus(s)).toBe("Prompt Uplift on (skip next)");
		expect(formatStatus(state({ enabled: false }), { root: "BUILD_PROMPT", source: "llm" })).toBe(
			"Prompt Uplift off\nLast: BUILD_PROMPT (llm)",
		);
	});

	test("last requests showing the stored uplift", () => {
		const s = state();
		const result = applyCommand(s, "last");
		expect(result.showLast).toBe(true);
		expect(s.enabled).toBe(true);
	});

	test("formatUpliftEcho includes header and full xml", () => {
		const xml = "<BUILD_PROMPT><ORIGINAL>x</ORIGINAL></BUILD_PROMPT>";
		expect(formatUpliftEcho({ root: "BUILD_PROMPT", source: "llm", xml })).toBe(
			`Prompt Uplift · BUILD_PROMPT · llm\n\n${xml}`,
		);
	});

	test("aio uplift off disables via parsed args", () => {
		const s = state({ enabled: true });
		const parsed = parseAioArgs("uplift off");
		const result = applyCommand(s, parsed.cmd);
		expect(parsed.cmd).toBe("off");
		expect(s.enabled).toBe(false);
		expect(result.message).toBe("Prompt Uplift off");
	});
});
