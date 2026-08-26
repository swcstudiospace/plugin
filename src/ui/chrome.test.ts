import { describe, expect, test } from "bun:test";
import { createChromeWidget, type ChromeState } from "./chrome.ts";

const theme = {
	fg: (_color: string, text: string) => text,
};

const tui = {};

const idle: ChromeState = {
	upliftOn: false,
	thinkOn: false,
};

function render(state: ChromeState, paintTheme = theme): string {
	return createChromeWidget(state)(tui, paintTheme).render(80).join("\n");
}

describe("createChromeWidget", () => {
	test("render contains Uplift", () => {
		expect(render(idle)).toContain("Uplift");
	});

	test("uplift on includes root and source", () => {
		const text = render({
			...idle,
			upliftOn: true,
			lastRoot: "BUILD_PROMPT",
			lastSource: "llm",
		});
		expect(text).toContain("Uplift on · BUILD_PROMPT · llm");
	});

	test("uplift off", () => {
		expect(render(idle)).toContain("Uplift off");
	});

	test("think on includes node count", () => {
		const text = render({ ...idle, thinkOn: true, thinkNodes: 5 });
		expect(text).toContain("Think on · 5 nodes");
	});

	test("think off", () => {
		expect(render(idle)).toContain("Think off");
	});

	test("tools idle or last tool", () => {
		expect(render(idle)).toContain("Tools idle");
		expect(render({ ...idle, lastTool: "bash" })).toContain("Tool ▶ bash");
	});

	test("pod connected, off, and disabled", () => {
		expect(render(idle)).toContain("Pod disabled");
		expect(
			render({
				...idle,
				pod: { enabled: true, connected: false },
			}),
		).toContain("Pod off");
		expect(
			render({
				...idle,
				pod: { enabled: true, connected: true, workspaceId: "ws-1" },
			}),
		).toContain("Pod connected · ws-1");
	});

	test("stays within 6 lines", () => {
		const lines = createChromeWidget({
			upliftOn: true,
			lastRoot: "FIX_PROMPT",
			lastSource: "fallback",
			thinkOn: true,
			thinkNodes: 8,
			lastTool: "edit",
			pod: { enabled: true, connected: true, workspaceId: "pod" },
		})(tui, theme).render(80);
		expect(lines.length).toBeLessThanOrEqual(6);
	});

	test("theme.fg throw still renders", () => {
		const throwing = {
			fg: () => {
				throw new Error("no color");
			},
		};
		expect(render(idle, throwing)).toContain("Uplift");
	});
});
