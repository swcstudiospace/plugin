import { Box, Text, type Component } from "@oh-my-pi/pi-tui";
import { paint, type PaintTheme } from "./paint.ts";

export interface ChromeState {
	upliftOn: boolean;
	lastRoot?: string;
	lastSource?: string;
	thinkOn: boolean;
	thinkNodes?: number;
	lastTool?: string;
	pod?: {
		enabled: boolean;
		connected: boolean;
		workspaceId?: string;
	};
}

const MAX_CHROME_LINES = 6;

export function createChromeWidget(state: ChromeState): (tui: unknown, theme: PaintTheme) => Component {
	return (_tui: unknown, theme: PaintTheme): Component => {
		const uplift = state.upliftOn
			? ["Uplift on", state.lastRoot, state.lastSource].filter((part): part is string => Boolean(part)).join(" · ")
			: "Uplift off";
		const think = !state.thinkOn
			? "Think off"
			: state.thinkNodes != null
				? `Think on · ${state.thinkNodes} nodes`
				: "Think on";
		const tool = state.lastTool ? `Tool ▶ ${state.lastTool}` : "Tools idle";
		const pod = state.pod;
		let podText = "Pod disabled";
		let podColor = "muted";
		if (pod?.enabled && pod.connected) {
			podText = pod.workspaceId ? `Pod connected · ${pod.workspaceId}` : "Pod connected";
			podColor = "success";
		} else if (pod?.enabled) {
			podText = "Pod off";
			podColor = "warning";
		}

		const lines = [
			paint(theme, state.upliftOn ? "success" : "muted", uplift),
			paint(theme, state.thinkOn ? "accent" : "muted", think),
			paint(theme, state.lastTool ? "warning" : "dim", tool),
			paint(theme, podColor, podText),
		].slice(0, MAX_CHROME_LINES);

		const box = new Box(0, 0);
		for (const line of lines) {
			box.addChild(new Text(line, 0, 0));
		}
		return box;
	};
}
