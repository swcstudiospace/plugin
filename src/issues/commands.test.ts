import { describe, expect, test } from "bun:test";
import {
	applyIssueToggle,
	ISSUE_COMPLETIONS,
	KANBAN_COMPLETIONS,
	parseIssueArgs,
} from "./commands.ts";

describe("parseIssueArgs", () => {
	test("issues default is list", () => {
		expect(parseIssueArgs("issues", "")).toEqual({ cmd: "list", rest: "" });
		expect(parseIssueArgs("issues", "   ")).toEqual({ cmd: "list", rest: "" });
	});

	test("kanban default is board", () => {
		expect(parseIssueArgs("kanban", "")).toEqual({ cmd: "board", rest: "" });
	});

	test("issues cmds and rest", () => {
		expect(parseIssueArgs("issues", "status")).toEqual({ cmd: "status", rest: "" });
		expect(parseIssueArgs("issues", "sync now")).toEqual({ cmd: "sync", rest: "now" });
		expect(parseIssueArgs("issues", "LAST extra")).toEqual({ cmd: "last", rest: "extra" });
		expect(parseIssueArgs("issues", "on")).toEqual({ cmd: "on", rest: "" });
		expect(parseIssueArgs("issues", "off")).toEqual({ cmd: "off", rest: "" });
		expect(parseIssueArgs("issues", "list")).toEqual({ cmd: "list", rest: "" });
	});

	test("kanban cmds and rest", () => {
		expect(parseIssueArgs("kanban", "sync")).toEqual({ cmd: "sync", rest: "" });
		expect(parseIssueArgs("kanban", "open overlay")).toEqual({ cmd: "open", rest: "overlay" });
		expect(parseIssueArgs("kanban", "STATUS")).toEqual({ cmd: "status", rest: "" });
		expect(parseIssueArgs("kanban", "board")).toEqual({ cmd: "board", rest: "" });
	});
});

describe("applyIssueToggle", () => {
	test("on enables", () => {
		const state = { enabled: false };
		expect(applyIssueToggle(state, "on")).toEqual({ enabled: true, message: "Issue tracking on" });
		expect(state.enabled).toBe(true);
	});

	test("off disables", () => {
		const state = { enabled: true };
		expect(applyIssueToggle(state, "off")).toEqual({ enabled: false, message: "Issue tracking off" });
		expect(state.enabled).toBe(false);
	});

	test("toggle flips enabled", () => {
		const state = { enabled: true };
		expect(applyIssueToggle(state, "toggle").message).toBe("Issue tracking off");
		expect(state.enabled).toBe(false);
		expect(applyIssueToggle(state, "toggle")).toEqual({ enabled: true, message: "Issue tracking on" });
		expect(state.enabled).toBe(true);
	});
});

describe("completions", () => {
	test("issues completions cover listed cmds", () => {
		expect(ISSUE_COMPLETIONS.map((item) => item.value)).toEqual(["list", "status", "sync", "last", "on", "off"]);
	});

	test("kanban completions cover listed cmds", () => {
		expect(KANBAN_COMPLETIONS.map((item) => item.value)).toEqual(["board", "sync", "open", "status"]);
	});
});
