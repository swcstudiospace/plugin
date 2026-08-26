import { describe, expect, test } from "bun:test";
import { LSP_COMPLETIONS, parseLspArgs } from "./commands.ts";

describe("parseLspArgs", () => {
	test("empty args is status", () => {
		expect(parseLspArgs("")).toEqual({ cmd: "status", rest: "" });
		expect(parseLspArgs("   ")).toEqual({ cmd: "status", rest: "" });
	});

	test("cmds and rest", () => {
		expect(parseLspArgs("status")).toEqual({ cmd: "status", rest: "" });
		expect(parseLspArgs("diagnostics")).toEqual({ cmd: "diagnostics", rest: "" });
		expect(parseLspArgs("diagnostics src/lib.rs")).toEqual({ cmd: "diagnostics", rest: "src/lib.rs" });
		expect(parseLspArgs("STATUS")).toEqual({ cmd: "status", rest: "" });
		expect(parseLspArgs("DIAGNOSTICS src/foo.ts extra")).toEqual({
			cmd: "diagnostics",
			rest: "src/foo.ts extra",
		});
	});
});

describe("completions", () => {
	test("lsp completions cover listed cmds", () => {
		expect(LSP_COMPLETIONS.map((item) => item.value)).toEqual(["status", "diagnostics"]);
	});
});
