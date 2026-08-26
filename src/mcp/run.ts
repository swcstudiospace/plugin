import type { CliRunner } from "./types.ts";

export const defaultCliRunner: CliRunner = async (bin, args, cwd) => {
	const proc = Bun.spawn([bin, ...args], {
		cwd,
		stdout: "pipe",
		stderr: "pipe",
		stdin: "ignore",
	});
	const [stdout, stderr, code] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
		proc.exited,
	]);
	return { stdout, stderr, code };
};
