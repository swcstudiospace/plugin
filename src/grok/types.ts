/**
 * Configuration types for the Grok 4.6 thinking engine and the local
 * Anthropic-compatible proxy that routes Claude Code's Haiku tier to Grok.
 */

export type GrokEffort = "low" | "medium" | "high" | "xhigh";

export const GROK_EFFORTS: readonly GrokEffort[] = ["low", "medium", "high", "xhigh"];

export type GrokTransport = "http" | "cli";

export interface GrokProxyConfig {
	enabled: boolean;
	host: string;
	port: number;
	upstream: string;
	haikuModel: string;
	routeModels: string[];
	stripThinking: boolean;
}

export interface GrokConfig {
	enabled: boolean;
	baseUrl: string;
	model: string;
	/** "Grok 4.6 Ultra" = grok-4.6 at xhigh. */
	reasoningEffort: GrokEffort;
	transport: GrokTransport;
	bin: string;
	/** Empty → $GROK_HOME or ~/.grok. */
	home: string;
	callTimeoutMs: number;
	/** Never silently downgrade to Claude by default. */
	fallbackToClaude: boolean;
	proxy: GrokProxyConfig;
}

export const DEFAULT_PROXY_PORT = 41417;

export const DEFAULT_GROK_CONFIG: GrokConfig = {
	enabled: true,
	baseUrl: "https://cli-chat-proxy.grok.com/v1",
	model: "grok-4.6",
	reasoningEffort: "xhigh",
	transport: "http",
	bin: "grok",
	home: "",
	callTimeoutMs: 240_000,
	fallbackToClaude: false,
	proxy: {
		enabled: true,
		host: "127.0.0.1",
		port: DEFAULT_PROXY_PORT,
		upstream: "https://api.anthropic.com",
		haikuModel: "grok-4.6",
		routeModels: ["grok-"],
		stripThinking: true,
	},
};

export const GROK_CLIENT_VERSION_FALLBACK = "1.0.25";
