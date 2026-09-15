import { describe, expect, test } from "bun:test";
import { createAnthropicSseNormalizer, normalizeMessageJson } from "./sse.ts";

/** Reproduces the real upstream stream: all starts at index 0, deltas without index, xai-usage comments. */
const UPSTREAM_EVENTS = [
	'event: message_start\ndata: {"type":"message_start","message":{"id":"msg_1","type":"message","role":"assistant","content":[],"model":"grok-4.6","usage":{"input_tokens":3,"output_tokens":0}}}\n\n',
	": xai-usage {\"prompt_tokens\":3}\n\n",
	'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"thinking","thinking":"","signature":""}}\n\n',
	'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"thinking_delta","thinking":"hmm"}}\n\n',
	'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}\n\n',
	'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}\n\n',
	'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hel"}}\n\n',
	'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"lo"}}\n\n',
	'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}\n\n',
	'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":5}}\n\n',
	'event: message_stop\ndata: {"type":"message_stop"}\n\n',
];

interface Parsed {
	event?: string;
	comment?: string;
	data?: Record<string, unknown>;
}

function parseOutput(text: string): Parsed[] {
	return text
		.split("\n\n")
		.filter((chunk) => chunk !== "")
		.map((chunk) => {
			const out: Parsed = {};
			for (const line of chunk.split("\n")) {
				if (line.startsWith(":")) out.comment = line;
				else if (line.startsWith("event: ")) out.event = line.slice(7);
				else if (line.startsWith("data: ")) out.data = JSON.parse(line.slice(6));
			}
			return out;
		});
}

async function run(chunks: string[], stripThinking: boolean): Promise<string> {
	const encoder = new TextEncoder();
	const source = new ReadableStream<Uint8Array>({
		start(controller) {
			for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
			controller.close();
		},
	});
	return await new Response(source.pipeThrough(createAnthropicSseNormalizer({ stripThinking }))).text();
}

/** Splits the fixture so one event straddles two chunks. */
function splitAcrossChunks(events: string[]): string[] {
	const joined = events.join("");
	const cut = joined.indexOf('"text_delta","text":"Hel') + 10;
	return [joined.slice(0, cut), joined.slice(cut)];
}

describe("createAnthropicSseNormalizer", () => {
	test("renumbers blocks sequentially and adds index to deltas when thinking is kept", async () => {
		const out = parseOutput(await run(splitAcrossChunks(UPSTREAM_EVENTS), false));
		const byEvent = (name: string) => out.filter((e) => e.event === name);

		expect(byEvent("content_block_start").map((e) => e.data?.index)).toEqual([0, 1]);
		expect(byEvent("content_block_delta").map((e) => e.data?.index)).toEqual([0, 1, 1]);
		expect(byEvent("content_block_stop").map((e) => e.data?.index)).toEqual([0, 1]);
		const textDeltas = byEvent("content_block_delta").filter((e) => e.data?.index === 1);
		expect(textDeltas.map((e) => (e.data?.delta as { text: string }).text)).toEqual(["Hel", "lo"]);
	});

	test("strips thinking blocks and keeps the text block at index 0", async () => {
		const out = parseOutput(await run(splitAcrossChunks(UPSTREAM_EVENTS), true));
		const types = out.map((e) => e.event ?? e.comment);
		expect(types).toEqual([
			"message_start",
			': xai-usage {"prompt_tokens":3}',
			"content_block_start",
			"content_block_delta",
			"content_block_delta",
			"content_block_stop",
			"message_delta",
			"message_stop",
		]);
		const start = out.find((e) => e.event === "content_block_start");
		expect(start?.data?.index).toBe(0);
		expect((start?.data?.content_block as { type: string }).type).toBe("text");
		for (const e of out.filter((x) => x.event === "content_block_delta" || x.event === "content_block_stop")) {
			expect(e.data?.index).toBe(0);
		}
		expect(JSON.stringify(out)).not.toContain("thinking");
	});

	test("passes comments and message_* events through byte-for-byte", async () => {
		const text = await run(UPSTREAM_EVENTS, true);
		expect(text).toContain(UPSTREAM_EVENTS[0]);
		expect(text).toContain(UPSTREAM_EVENTS[1]);
		expect(text).toContain(UPSTREAM_EVENTS[9]);
		expect(text).toContain(UPSTREAM_EVENTS[10]);
	});

	test("tolerates CRLF separators and flushes a trailing partial event", async () => {
		const crlf = UPSTREAM_EVENTS.slice(5, 7).map((e) => e.replace(/\n/g, "\r\n"));
		const trailing = 'event: content_block_stop\r\ndata: {"type":"content_block_stop","index":0}';
		const out = parseOutput(await run([...crlf, trailing], false));
		expect(out.map((e) => e.event)).toEqual(["content_block_start", "content_block_delta", "content_block_stop"]);
		expect(out.map((e) => e.data?.index)).toEqual([0, 0, 0]);
	});

	test("strips thinking blocks from message_start content when present", async () => {
		const start =
			'event: message_start\ndata: {"type":"message_start","message":{"content":[{"type":"thinking","thinking":"x"},{"type":"text","text":"y"}]}}\n\n';
		const out = parseOutput(await run([start], true));
		expect((out[0]?.data?.message as { content: unknown[] }).content).toEqual([{ type: "text", text: "y" }]);
	});
});

describe("normalizeMessageJson", () => {
	const message = {
		type: "message",
		content: [
			{ type: "thinking", thinking: "…", signature: "" },
			{ type: "redacted_thinking", data: "…" },
			{ type: "text", text: "hi" },
		],
		stop_reason: "end_turn",
	};

	test("removes thinking blocks when stripping and returns a new object", () => {
		const out = normalizeMessageJson(message, { stripThinking: true }) as typeof message;
		expect(out.content).toEqual([{ type: "text", text: "hi" }]);
		expect(out.stop_reason).toBe("end_turn");
		expect(out).not.toBe(message);
		expect(message.content).toHaveLength(3);
	});

	test("keeps everything when not stripping, and keeps an empty array when only thinking existed", () => {
		expect(normalizeMessageJson(message, { stripThinking: false })).toBe(message);
		const only = { content: [{ type: "thinking", thinking: "x" }] };
		expect(normalizeMessageJson(only, { stripThinking: true })).toEqual({ content: [] });
		expect(normalizeMessageJson("nope", { stripThinking: true })).toBe("nope");
	});
});
