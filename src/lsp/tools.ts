import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import type { TSchema } from "@oh-my-pi/pi-ai";
import { Type } from "typebox";
import { resolveMutationPath, type LspHub } from "./hub.ts";

export function registerLspTools(pi: ExtensionAPI, hub: LspHub): void {
	pi.registerTool({
		name: "lsp_status",
		label: "LSP Status",
		description: "Show live language server status for this workspace.",
		parameters: Type.Object({}) as unknown as TSchema,
		loadMode: "essential",
		approval: "read",
		async execute() {
			try {
				return { content: [{ type: "text", text: hub.formatStatus() }] };
			} catch {
				return { content: [{ type: "text", text: "" }] };
			}
		},
	});

	pi.registerTool({
		name: "lsp_diagnostics",
		label: "LSP Diagnostics",
		description: "Show live LSP diagnostics. Optional path syncs that file first.",
		parameters: Type.Object({
			path: Type.Optional(Type.String({ description: "File to sync before reading diagnostics" })),
		}) as unknown as TSchema,
		loadMode: "essential",
		approval: "read",
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			try {
				const abs = resolveMutationPath(ctx?.cwd ?? hub.cwd, params as Record<string, unknown>);
				if (abs) await hub.onFileMutation(abs);
				return {
					content: [
						{
							type: "text",
							text: hub.parentDigest() || hub.digest(["error", "warning"], 20, 4096) || "No LSP diagnostics.",
						},
					],
				};
			} catch {
				return { content: [{ type: "text", text: "No LSP diagnostics." }] };
			}
		},
	});
}
