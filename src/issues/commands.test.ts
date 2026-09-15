import { describe, expect, test } from "bun:test";
import {
	applyIssueToggle,
	ISSUE_COMPLETIONS,
	parseIssueArgs,
} from "./commands.ts";

describe("parseIssueArgs", () => {
	test("issues default is list", () => {
		expect(parseIssueArgs("")).toEqual({ cmd: "list", rest: "" });
		expect(parseIssueArgs("   ")).toEqual({ cmd: "list", rest: "" });
	});

	test("issues cmds and rest", () => {
		expect(parseIssueArgs("status")).toEqual({ cmd: "status", rest: "" });
		expect(parseIssueArgs("sync now")).toEqual({ cmd: "sync", rest: "now" });
		expect(parseIssueArgs("LAST extra")).toEqual({ cmd: "last", rest: "extra" });
		expect(parseIssueArgs("on")).toEqual({ cmd: "on", rest: "" });
		expect(parseIssueArgs("off")).toEqual({ cmd: "off", rest: "" });
		expect(parseIssueArgs("list")).toEqual({ cmd: "list", rest: "" });
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

});
