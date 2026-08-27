import { describe, expect, test } from "bun:test";
import { registerAioRenderers } from "./renderers.ts";

const TYPES = ["aio-uplift", "aio-think", "aio-issue", "aio-lsp"] as const;

const LABELS = {
	"aio-uplift": "Prompt Uplift",
	"aio-think": "Graph of Thought",
	"aio-issue": "Issue",
	"aio-lsp": "Live LSP",
} as const;

type Renderer = (
	message: unknown,
	options: unknown,
	theme: unknown,
) => { render: (width: number) => readonly string[] } | undefined;

function capture(): Map<string, Renderer> {
	const map = new Map<string, Renderer>();
	registerAioRenderers({
		registerMessageRenderer: (customType: string, renderer: Renderer) => {
			map.set(customType, renderer);
		},
	});
	return map;
}

function theme(fn?: (color: string, text: string) => string) {
	return {
		fg: fn ?? ((_color: string, text: string) => text),
	};
}

describe("registerAioRenderers", () => {
	test("registers four custom types", () => {
		const map = capture();
		expect([...map.keys()]).toEqual([...TYPES]);
	});

	test("each renderer render(40) includes label", () => {
		const map = capture();
		const mock = theme();
		for (const customType of TYPES) {
			const renderer = map.get(customType);
			expect(renderer).toBeDefined();
			const card = renderer!({ content: "hello" }, { expanded: false }, mock);
			expect(card).toBeDefined();
			expect(card!.render(40).join("\n")).toContain(LABELS[customType]);
		}
	});

	test("returns undefined on garbage so the default frame is used", () => {
		const renderer = capture().get("aio-uplift")!;
		const mock = theme();
		expect(renderer(undefined, { expanded: false }, mock)).toBeUndefined();
		expect(renderer(null, { expanded: false }, mock)).toBeUndefined();
		expect(renderer("hello", { expanded: false }, mock)).toBeUndefined();
		expect(renderer({}, { expanded: false }, mock)).toBeUndefined();
		expect(renderer({ content: 1 }, { expanded: false }, mock)).toBeUndefined();
		expect(renderer({ content: { foo: "bar" } }, { expanded: false }, mock)).toBeUndefined();
	});

	test("object content shows header and clips to 8 lines when collapsed", () => {
		const renderer = capture().get("aio-uplift")!;
		const xml = Array.from({ length: 12 }, (_, i) => `line-${i + 1}`).join("\n");
		const message = { content: { xml, root: "BUILD_PROMPT", source: "llm" } };
		const collapsed = renderer(message, { expanded: false }, theme());
		const expanded = renderer(message, { expanded: true }, theme());
		expect(collapsed).toBeDefined();
		expect(expanded).toBeDefined();
		const collapsedText = collapsed!.render(40).join("\n");
		const expandedText = expanded!.render(40).join("\n");
		expect(collapsedText).toContain("Prompt Uplift · BUILD_PROMPT · llm");
		expect(collapsedText).toContain("line-8");
		expect(collapsedText).not.toContain("line-9");
		expect(expandedText).toContain("line-12");
	});

	test("paint swallows theme.fg throws", () => {
		const renderer = capture().get("aio-issue")!;
		const card = renderer(
			{ content: "hello" },
			{ expanded: false },
			theme(() => {
				throw new Error("bad color");
			}),
		);
		expect(card).toBeDefined();
		expect(card!.render(40).join("\n")).toContain("Issue");
	});
});
