import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import type { TSchema } from "@oh-my-pi/pi-ai";
import { Type } from "typebox";
import type { PodSession } from "./types.ts";

export function registerPodTools(
	pi: ExtensionAPI,
	deps: {
		enabled: () => boolean;
		session: () => PodSession | undefined;
	},
): void {
	pi.registerTool({
		name: "pod_status",
		label: "Pod Status",
		description: "Show pod workspace status. Never includes tokens.",
		parameters: Type.Object({}) as unknown as TSchema,
		loadMode: "essential",
		approval: "read",
		async execute() {
			try {
				if (!deps.enabled()) {
					return { content: [{ type: "text", text: "Pod boot off" }] };
				}
				const session = deps.session();
				if (!session) {
					return { content: [{ type: "text", text: "" }] };
				}
				const lines = [
					session.workspaceId,
					`connected ${session.connected ? "yes" : "no"}`,
					session.localFolder,
					`${session.extraDirs.length} extra dirs`,
					`Anda ${session.engineActive ? "active" : "inactive"}`,
					"dTEE no",
				];
				return { content: [{ type: "text", text: lines.join("\n") }] };
			} catch {
				return { content: [{ type: "text", text: "" }] };
			}
		},
	});
}
