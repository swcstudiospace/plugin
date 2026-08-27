import { Box, Text, type Component } from "@oh-my-pi/pi-tui";
import { paint, type PaintTheme } from "./paint.ts";

const CARDS = {
	"aio-uplift": "Prompt Uplift",
	"aio-think": "Graph of Thought",
	"aio-issue": "Issue",
	"aio-lsp": "Live LSP",
} as const;

const PREVIEW_LINES = 8;

export function registerAioRenderers(pi: { registerMessageRenderer: Function }): void {
	for (const [customType, label] of Object.entries(CARDS)) {
		pi.registerMessageRenderer(customType, createRenderer(label));
	}
}

function createRenderer(label: string) {
	return (message: unknown, options: unknown, theme: PaintTheme): Component | undefined => {
		try {
			return renderCard(label, message, options, theme);
		} catch {
			return undefined;
		}
	};
}

function renderCard(
	label: string,
	message: unknown,
	options: unknown,
	theme: PaintTheme,
): Component | undefined {
	if (!message || typeof message !== "object" || !("content" in message)) return undefined;
	const parsed = parseContent(message.content);
	if (!parsed) return undefined;

	const header = parsed.bits.length > 0 ? `${label} · ${parsed.bits.join(" · ")}` : label;
	const expanded =
		!!options && typeof options === "object" && "expanded" in options && options.expanded === true;
	const body = preview(parsed.body, expanded);

	const box = new Box(1, 0);
	box.addChild(new Text(paint(theme, "accent", header), 0, 0));
	if (body) box.addChild(new Text(paint(theme, "muted", body), 0, 0));
	return box;
}

function parseContent(content: unknown): { bits: string[]; body: string } | undefined {
	if (typeof content === "string") return { bits: [], body: content };
	if (!content || typeof content !== "object" || Array.isArray(content)) return undefined;

	const xml = "xml" in content && typeof content.xml === "string" ? content.xml : undefined;
	const root = "root" in content && typeof content.root === "string" ? content.root : undefined;
	const source = "source" in content && typeof content.source === "string" ? content.source : undefined;
	if (xml === undefined && root === undefined && source === undefined) return undefined;

	const bits: string[] = [];
	if (root) bits.push(root);
	if (source) bits.push(source);
	return { bits, body: xml ?? "" };
}

function preview(body: string, expanded: boolean): string {
	if (expanded || !body) return body;
	const lines = body.split("\n");
	if (lines.length <= PREVIEW_LINES) return body;
	return lines.slice(0, PREVIEW_LINES).join("\n");
}
