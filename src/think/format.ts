import type { ThoughtGraph } from "./types.ts";

const CLIP = 80;

function clip(text: string, max: number): string {
	const flat = text.replace(/\s+/g, " ").trim();
	return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

export function formatThinkEcho(graph: ThoughtGraph): string {
	const header = ["id", "kind", "title", "conclusion"];
	const rows = graph.nodes.map((node) => [
		node.id,
		node.kind,
		node.title,
		clip(node.conclusion ?? "", CLIP),
	]);
	return [graph.goal, "", header.join("  "), ...rows.map((row) => row.join("  "))].join("\n");
}

export function formatThinkStatus(enabled: boolean, graph?: ThoughtGraph): string {
	if (!enabled) return "Think off";
	if (!graph) return "Think on";
	return `Think on · ${graph.nodes.length} nodes`;
}
