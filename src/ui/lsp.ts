import { Box, Text, type Component } from "@oh-my-pi/pi-tui";
import { paint, type PaintTheme } from "./paint.ts";

export interface LspWidgetState {
	digest?: string;
	statusLine?: string;
}

export function createLspWidget(state: LspWidgetState): (tui: unknown, theme: PaintTheme) => Component {
	return (_tui: unknown, theme: PaintTheme): Component => {
		const box = new Box(0, 0);
		const digest = state.digest?.trim();
		if (!digest) {
			box.addChild(new Text(paint(theme, "success", "LSP clean"), 0, 0));
			if (state.statusLine) {
				box.addChild(new Text(paint(theme, "muted", state.statusLine), 0, 0));
			}
			return box;
		}

		const digestLines = digest.split("\n").filter((line) => line.length > 0);
		const first = digestLines[0];
		if (first?.startsWith("LSP")) {
			box.addChild(new Text(paint(theme, "accent", first), 0, 0));
			for (const line of digestLines.slice(1)) {
				const color = line.trimStart().toLowerCase().startsWith("error") ? "error" : "warning";
				box.addChild(new Text(paint(theme, color, line), 0, 0));
			}
		} else {
			box.addChild(new Text(paint(theme, "accent", "LSP"), 0, 0));
			for (const line of digestLines) {
				const color = line.trimStart().toLowerCase().startsWith("error") ? "error" : "warning";
				box.addChild(new Text(paint(theme, color, line), 0, 0));
			}
		}
		if (state.statusLine) {
			box.addChild(new Text(paint(theme, "muted", state.statusLine), 0, 0));
		}
		return box;
	};
}
