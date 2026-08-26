import { describe, expect, test } from "bun:test";
import { parseShipArgs, PR_COMPLETIONS } from "./commands.ts";

describe("parseShipArgs", () => {
	test("pr default is list", () => {
		expect(parseShipArgs("pr", "")).toEqual({ cmd: "list", rest: "" });
		expect(parseShipArgs("pr", "   ")).toEqual({ cmd: "list", rest: "" });
	});

	test("pr create keeps the title rest", () => {
		expect(parseShipArgs("pr", "create")).toEqual({ cmd: "create", rest: "" });
		expect(parseShipArgs("pr", "create Fix the gate")).toEqual({ cmd: "create", rest: "Fix the gate" });
		expect(parseShipArgs("pr", "CREATE Title Here")).toEqual({ cmd: "create", rest: "Title Here" });
	});

	test("pr list", () => {
		expect(parseShipArgs("pr", "list")).toEqual({ cmd: "list", rest: "" });
		expect(parseShipArgs("pr", "LIST open")).toEqual({ cmd: "list", rest: "open" });
	});

	test("review rest is the optional base", () => {
		expect(parseShipArgs("review", "")).toEqual({ cmd: "review", rest: "" });
		expect(parseShipArgs("review", "main")).toEqual({ cmd: "review", rest: "main" });
		expect(parseShipArgs("review", "origin/main extra")).toEqual({ cmd: "review", rest: "origin/main" });
	});

	test("merge rest is the PR number", () => {
		expect(parseShipArgs("merge", "")).toEqual({ cmd: "merge", rest: "" });
		expect(parseShipArgs("merge", "12")).toEqual({ cmd: "merge", rest: "12" });
		expect(parseShipArgs("merge", "42 extra")).toEqual({ cmd: "merge", rest: "42" });
	});
});

describe("PR_COMPLETIONS", () => {
	test("covers create and list", () => {
		expect(PR_COMPLETIONS.map((item) => item.value)).toEqual(["create", "list"]);
	});
});
