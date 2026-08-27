import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import type { TSchema } from "@oh-my-pi/pi-ai";
import { Type } from "typebox";
import { formatPodDoctor } from "./format.ts";
import type { PodSession } from "./types.ts";

export function registerPodTools(
	pi: ExtensionAPI,
	deps: {
		enabled: () => boolean;
		session: () => PodSession | undefined;
		doctor?: () => Promise<Parameters<typeof formatPodDoctor>[0]>;
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
				if (deps.doctor) {
					return { content: [{ type: "text", text: formatPodDoctor(await deps.doctor()) }] };
				}
				const session = deps.session();
				if (session) {
					return {
						content: [
							{
								type: "text",
								text: formatPodDoctor({
									bin: "devpod",
									binOk: true,
									enabled: session.enabled,
									connected: session.connected,
									workspaceId: session.workspaceId,
									workspaces: 0,
									engineActive: session.engineActive,
									nexusUrl: session.nexusUrl,
									dtee: session.dtee,
									dteeUrl: "http://127.0.0.1:8443",
									extraDirs: session.extraDirs.length,
									localFolder: session.localFolder,
									reason: session.reason,
								}),
							},
						],
					};
				}
				if (!deps.enabled()) {
					return { content: [{ type: "text", text: "Pod boot off" }] };
				}
				return { content: [{ type: "text", text: "" }] };
			} catch {
				return { content: [{ type: "text", text: "" }] };
			}
		},
	});
}
