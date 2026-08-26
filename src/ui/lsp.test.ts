import { describe, expect, test } from "bun:test";
import { createLspWidget } from "./lsp.ts";

const theme = {
	fg: (_color: string, text: string) => text,
};

const tui = {};

function render(state: { digest?: string; statusLine?: string }, paintTheme = theme): string {
	return createLspWidget(state)(tui, paintTheme).render(80).join("\n");
}

describe("createLspWidget", () => {
	test("render contains LSP when clean", () => {
		const text = render({});
		expect(text).toContain("LSP");
		expect(text).toContain("LSP clean");
	});

	test("empty digest is still LSP clean", () => {
		expect(render({ digest: "" })).toContain("LSP clean");
		expect(render({ digest: "   " })).toContain("LSP clean");
	});

	test("digest paints accent header and diagnostic lines", () => {
		const text = render({
			digest: "LSP [2 error|warning]\nerror src/a.ts:1:1 [tsserver] boom\nwarning src/b.ts:2:2 [tsserver] eh",
		});
		expect(text).toContain("LSP");
		expect(text).toContain("LSP [2 error|warning]");
		expect(text).toContain("error src/a.ts:1:1");
		expect(text).toContain("warning src/b.ts:2:2");
	});

	test("digest without LSP prefix still adds LSP header", () => {
		const text = render({ digest: "error foo.ts:1:1 [tsc] no" });
		expect(text).toContain("LSP");
		expect(text).toContain("error foo.ts:1:1");
	});

	test("statusLine is shown", () => {
		expect(render({ statusLine: "ts: initialize ok" })).toContain("ts: initialize ok");
	});

	test("theme.fg throw still renders LSP", () => {
		const throwing = {
			fg: () => {
				throw new Error("no color");
			},
		};
		expect(render({}, throwing)).toContain("LSP");
	});

	test("uses success for clean and warning/error for digest via theme.fg", () => {
		const colors: string[] = [];
		const tracking = {
			fg: (color: string, text: string) => {
				colors.push(color);
				return text;
			},
		};
		render({}, tracking);
		expect(colors).toContain("success");
		colors.length = 0;
		render(
			{
				digest: "LSP [1 error]\nerror src/x.ts:1:1 [tsc] bad",
			},
			tracking,
		);
		expect(colors).toContain("accent");
		expect(colors).toContain("error");
	});
});
