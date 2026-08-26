import { describe, expect, test } from "bun:test";
import { applyThinkToggle, parseThinkArgs, THINK_COMPLETIONS } from "./commands.ts";

describe("parseThinkArgs", () => {
	test("empty args is status", () => {
		expect(parseThinkArgs("")).toEqual({ cmd: "status", rest: "" });
		expect(parseThinkArgs("   ")).toEqual({ cmd: "status", rest: "" });
	});

	test("cmds and rest", () => {
		expect(parseThinkArgs("status")).toEqual({ cmd: "status", rest: "" });
		expect(parseThinkArgs("on")).toEqual({ cmd: "on", rest: "" });
		expect(parseThinkArgs("off")).toEqual({ cmd: "off", rest: "" });
		expect(parseThinkArgs("toggle")).toEqual({ cmd: "toggle", rest: "" });
		expect(parseThinkArgs("last extra")).toEqual({ cmd: "last", rest: "extra" });
		expect(parseThinkArgs("LAST extra")).toEqual({ cmd: "last", rest: "extra" });
		expect(parseThinkArgs("ON now")).toEqual({ cmd: "on", rest: "now" });
	});
});

describe("applyThinkToggle", () => {
	test("on enables", () => {
		const state = { enabled: false };
		expect(applyThinkToggle(state, "on")).toEqual({ enabled: true, message: "Graph of Thought on" });
		expect(state.enabled).toBe(true);
	});

	test("off disables", () => {
		const state = { enabled: true };
		expect(applyThinkToggle(state, "off")).toEqual({ enabled: false, message: "Graph of Thought off" });
		expect(state.enabled).toBe(false);
	});

	test("toggle flips enabled", () => {
		const state = { enabled: true };
		expect(applyThinkToggle(state, "toggle").message).toBe("Graph of Thought off");
		expect(state.enabled).toBe(false);
		expect(applyThinkToggle(state, "toggle")).toEqual({ enabled: true, message: "Graph of Thought on" });
		expect(state.enabled).toBe(true);
	});

	test("status and last leave enabled unchanged", () => {
		const on = { enabled: true };
		expect(applyThinkToggle(on, "status")).toEqual({ enabled: true, message: "Graph of Thought on" });
		expect(on.enabled).toBe(true);
		expect(applyThinkToggle(on, "last")).toEqual({ enabled: true, message: "Graph of Thought on" });
		expect(on.enabled).toBe(true);
		const off = { enabled: false };
		expect(applyThinkToggle(off, "")).toEqual({ enabled: false, message: "Graph of Thought off" });
		expect(off.enabled).toBe(false);
	});
});

describe("completions", () => {
	test("think completions cover listed cmds", () => {
		expect(THINK_COMPLETIONS.map((item) => item.value)).toEqual(["on", "off", "toggle", "status", "last"]);
	});
});
