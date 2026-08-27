import type { PodDoctor } from "./types.ts";

export function formatPodDoctor(doctor: PodDoctor): string {
	const workspace = doctor.workspaceState
		? `workspace ${doctor.workspaceId} ${doctor.workspaceState}`
		: `workspace ${doctor.workspaceId}`;
	const lines = [
		`bin ${doctor.bin} ${doctor.binOk ? "ok" : "missing"}`,
		`enabled ${doctor.enabled ? "yes" : "no"}`,
		workspace,
		`connected ${doctor.connected ? "yes" : "no"}`,
		`Anda ${doctor.engineActive ? "active" : "inactive"} (${doctor.nexusUrl})`,
		`dTEE ${doctor.dtee ? "yes" : "no"} (${doctor.dteeUrl})`,
		`${doctor.workspaces} workspace${doctor.workspaces === 1 ? "" : "s"}`,
	];
	if (doctor.localFolder) lines.push(doctor.localFolder);
	if (doctor.reason) lines.push(doctor.reason);
	return lines.join("\n");
}
