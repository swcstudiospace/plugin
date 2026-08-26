import { describe, expect, test } from "bun:test";
import { formatPodDoctor } from "./format.ts";

const full = {
	bin: "/usr/local/bin/devpod",
	binOk: true,
	enabled: true,
	connected: false,
	workspaceId: "ai-agency",
	workspaceState: "Stopped",
	workspaces: 3,
	engineActive: true,
	nexusUrl: "http://127.0.0.1:8091",
	dtee: false,
	dteeUrl: "http://127.0.0.1:8443",
	extraDirs: 2,
	localFolder: "/tmp/ws",
	reason: "workspace stopped",
};

describe("formatPodDoctor", () => {
	test("formats all lines including Stopped, Anda active, dTEE no, folder, reason", () => {
		expect(formatPodDoctor(full)).toBe(
			[
				"bin /usr/local/bin/devpod ok",
				"enabled yes",
				"workspace ai-agency Stopped",
				"connected no",
				"Anda active (http://127.0.0.1:8091)",
				"dTEE no (http://127.0.0.1:8443)",
				"3 workspaces",
				"/tmp/ws",
				"workspace stopped",
			].join("\n"),
		);
	});

	test("missing binOk uses missing", () => {
		expect(formatPodDoctor({ ...full, binOk: false, localFolder: undefined, reason: undefined })).toContain(
			"bin /usr/local/bin/devpod missing",
		);
	});

	test("omitted workspaceState has no extra token", () => {
		const { workspaceState: _, ...rest } = full;
		expect(formatPodDoctor(rest).split("\n")[2]).toBe("workspace ai-agency");
	});
});
