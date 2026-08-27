import type { CliResult, CliRunner } from "../mcp/types.ts";

export async function invokeCli(
	run: CliRunner,
	bin: string,
	args: string[],
	cwd?: string,
): Promise<CliResult> {
	try {
		return await run(bin, args, cwd);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return { stdout: "", stderr: message, code: 127 };
	}
}
