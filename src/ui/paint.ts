export interface PaintTheme {
	fg(color: string, text: string): string;
}

export function paint(theme: PaintTheme, color: string, text: string): string {
	try {
		return theme.fg(color, text);
	} catch {
		return text;
	}
}
