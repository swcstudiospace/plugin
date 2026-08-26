import {
	completeSimple,
	type ImageContent,
	type TextContent,
	type UserMessage,
} from "@oh-my-pi/pi-ai";
import type { ExtensionContext } from "@oh-my-pi/pi-coding-agent";

const DEFAULT_CONVERSATION_CHARS = 3500;
const MAX_SNIPPETS = 8;
const MAX_MESSAGE_CHARS = 600;

function textOf(response: { content: Array<{ type: string; text?: string }> }): string {
	return response.content
		.filter((block): block is { type: "text"; text: string } => block.type === "text" && typeof block.text === "string")
		.map((block) => block.text)
		.join("\n")
		.trim();
}

function extractTextParts(content: unknown): string {
	if (typeof content === "string") return content.trim();
	if (!Array.isArray(content)) return "";
	const parts: string[] = [];
	for (const part of content) {
		if (!part || typeof part !== "object") continue;
		if (!("type" in part) || !("text" in part)) continue;
		if (part.type === "text" && typeof part.text === "string") parts.push(part.text);
	}
	return parts.join("\n").trim();
}

export async function completePrompt(
	ctx: ExtensionContext,
	systemPrompt: string,
	userText: string,
	options?: { images?: ImageContent[]; signal?: AbortSignal },
): Promise<string> {
	const model = ctx.model;
	if (!model) throw new Error("No model selected");

	const content: Array<TextContent | ImageContent> = [{ type: "text", text: userText }];
	if (options?.images?.length && model.input.includes("image")) {
		content.push(...options.images);
	}

	const userMessage: UserMessage = {
		role: "user",
		content,
		timestamp: Date.now(),
	};

	const apiKey = await ctx.modelRegistry.getApiKey(model);
	const response = await completeSimple(
		model,
		{ systemPrompt: [systemPrompt], messages: [userMessage] },
		{ signal: options?.signal, apiKey },
	);

	if (response.stopReason === "aborted") {
		const abortError = new Error("Aborted");
		abortError.name = "AbortError";
		throw abortError;
	}

	return textOf(response);
}

export function recentConversation(ctx: ExtensionContext, maxChars = DEFAULT_CONVERSATION_CHARS): string {
	const manager = ctx.sessionManager;
	if (!manager || typeof manager.getBranch !== "function") return "";
	const branch = manager.getBranch();
	if (!Array.isArray(branch) || branch.length === 0) return "";

	const chunks: string[] = [];
	for (let i = branch.length - 1; i >= 0 && chunks.length < MAX_SNIPPETS; i--) {
		const entry = branch[i];
		if (!entry || typeof entry !== "object" || !("type" in entry) || entry.type !== "message") continue;
		if (!("message" in entry) || !entry.message || typeof entry.message !== "object") continue;
		const message = entry.message;
		if (!("role" in message) || (message.role !== "user" && message.role !== "assistant")) continue;
		const text = extractTextParts("content" in message ? message.content : undefined);
		if (!text) continue;
		const clipped = text.length > MAX_MESSAGE_CHARS ? `${text.slice(0, MAX_MESSAGE_CHARS)}…` : text;
		chunks.push(`${message.role === "user" ? "User" : "Assistant"}: ${clipped}`);
	}

	if (chunks.length === 0) return "";
	const combined = chunks.reverse().join("\n\n");
	return combined.length > maxChars ? combined.slice(-maxChars) : combined;
}
