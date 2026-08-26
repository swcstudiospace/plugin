import { describe, expect, test } from "bun:test";
import { parsePodArgs, POD_COMPLETIONS } from "./commands.ts";

describe("parsePodArgs", () => {
	test("empty args is status", () => {
		expect(parsePodArgs("")).toEqual({ cmd: "status", rest: "" });
		expect(parsePodArgs("   ")).toEqual({ cmd: "status", rest: "" });
	});

	test("status", () => {
		expect(parsePodArgs("status")).toEqual({ cmd: "status", rest: "" });
		expect(parsePodArgs("STATUS")).toEqual({ cmd: "status", rest: "" });
	});

	test("up preserves rest", () => {
		expect(parsePodArgs("up")).toEqual({ cmd: "up", rest: "" });
		expect(parsePodArgs("up extra")).toEqual({ cmd: "up", rest: "extra" });
		expect(parsePodArgs("UP workspace extra")).toEqual({ cmd: "up", rest: "workspace extra" });
	});

	test("connect", () => {
		expect(parsePodArgs("connect")).toEqual({ cmd: "connect", rest: "" });
		expect(parsePodArgs("CONNECT")).toEqual({ cmd: "connect", rest: "" });
	});

	test("doctor", () => {
		expect(parsePodArgs("doctor")).toEqual({ cmd: "doctor", rest: "" });
		expect(parsePodArgs("DOCTOR")).toEqual({ cmd: "doctor", rest: "" });
	});

	test("unknown kept as cmd", () => {
		expect(parsePodArgs("rpc")).toEqual({ cmd: "rpc", rest: "" });
		expect(parsePodArgs("RPC foo")).toEqual({ cmd: "rpc", rest: "foo" });
	});
});

describe("POD_COMPLETIONS", () => {
	test("covers status up connect doctor", () => {
		expect(POD_COMPLETIONS.map((item) => item.value)).toEqual([
			"status",
			"up",
			"connect",
			"doctor",
		]);
	});
});
