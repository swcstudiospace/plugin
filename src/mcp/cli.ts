import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "../config.ts";
import { createGithub } from "./github.ts";
import { createGreptile } from "./greptile.ts";
import { defaultCliRunner } from "./run.ts";
import { createAioMcpServer } from "./server.ts";

const config = loadConfig();
const github = createGithub({ run: defaultCliRunner, org: config.github.org });
const greptile = createGreptile({
	run: defaultCliRunner,
	bin: config.greptile.bin,
	minConfidence: config.greptile.minConfidence,
	requiredForMerge: config.greptile.requiredForMerge,
});
const server = createAioMcpServer({
	github,
	greptile,
	org: config.github.org,
});
await server.connect(new StdioServerTransport());
