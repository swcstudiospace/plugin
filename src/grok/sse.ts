/**
 * Normalizes Anthropic-format SSE streams coming from the Grok CLI chat proxy.
 *
 * Upstream defects handled here:
 * - every `content_block_start` carries `"index":0` (thinking and text blocks alike);
 * - `content_block_delta` events carry no `index` field at all.
 *
 * Blocks are renumbered sequentially and, when `stripThinking` is set, thinking
 * blocks (start/delta/stop) are removed and the remaining blocks stay contiguous.
 */

export interface SseNormalizeOptions {
	stripThinking: boolean;
}

const THINKING_BLOCK_TYPES: Record<string, true> = { thinking: true, redacted_thinking: true };

function isThinkingBlock(block: unknown): boolean {
	return (
		typeof block === "object" &&
		block !== null &&
		"type" in block &&
		typeof block.type === "string" &&
		THINKING_BLOCK_TYPES[block.type] === true
	);
}

/** Drops thinking blocks from a non-stream Messages response when requested. */
export function normalizeMessageJson(message: unknown, opts: SseNormalizeOptions): unknown {
	if (!opts.stripThinking || typeof message !== "object" || message === null || !("content" in message)) return message;
	if (!Array.isArray(message.content)) return message;
	return { ...message, content: message.content.filter((block) => !isThinkingBlock(block)) };
}

interface ParsedEvent {
	event?: string;
	data: string[];
}

/** Parses one SSE event (lines between blank lines). Returns undefined for comment-only events. */
function parseEvent(raw: string): ParsedEvent | undefined {
	let event: string | undefined;
	const data: string[] = [];
	let sawField = false;
	for (const line of raw.split("\n")) {
		if (line === "" || line.startsWith(":")) continue;
		sawField = true;
		const colon = line.indexOf(":");
		const field = colon === -1 ? line : line.slice(0, colon);
		let value = colon === -1 ? "" : line.slice(colon + 1);
		if (value.startsWith(" ")) value = value.slice(1);
		if (field === "event") event = value;
		else if (field === "data") data.push(value);
	}
	return sawField ? { event, data } : undefined;
}

interface BlockState {
	nextIndex: number;
	/** Renumbered index of the currently open block, or -1 when none/dropped. */
	current: number;
	dropped: boolean;
}

/** Anthropic stream event payload as far as the normalizer cares. */
interface StreamPayload {
	type?: unknown;
	index?: unknown;
	content_block?: unknown;
	message?: unknown;
	[key: string]: unknown;
}

function serialize(event: string | undefined, payload: StreamPayload): string {
	const head = event === undefined ? "" : `event: ${event}\n`;
	return `${head}data: ${JSON.stringify(payload)}\n\n`;
}

/**
 * Rewrites one raw SSE event. Returns the text to emit (possibly the original) or
 * the empty string when the event is dropped.
 */
function rewriteEvent(raw: string, state: BlockState, stripThinking: boolean): string {
	const parsed = parseEvent(raw);
	if (!parsed || parsed.data.length === 0) return raw;
	let json: unknown;
	try {
		json = JSON.parse(parsed.data.join("\n"));
	} catch {
		return raw;
	}
	if (typeof json !== "object" || json === null || Array.isArray(json)) return raw;
	// Parsed JSON object from the upstream stream; fields stay unknown and are checked below.
	const payload = json as StreamPayload;
	const type = parsed.event ?? (typeof payload.type === "string" ? payload.type : undefined);

	switch (type) {
		case "content_block_start": {
			if (stripThinking && isThinkingBlock(payload.content_block)) {
				state.dropped = true;
				state.current = -1;
				return "";
			}
			state.dropped = false;
			state.current = state.nextIndex++;
			return serialize(parsed.event, { ...payload, index: state.current });
		}
		case "content_block_delta": {
			if (state.dropped) return "";
			if (state.current < 0) return raw;
			return serialize(parsed.event, { ...payload, index: state.current });
		}
		case "content_block_stop": {
			if (state.dropped) {
				state.dropped = false;
				return "";
			}
			if (state.current < 0) return raw;
			const out = serialize(parsed.event, { ...payload, index: state.current });
			state.current = -1;
			return out;
		}
		case "message_start": {
			if (!stripThinking) return raw;
			const message = normalizeMessageJson(payload.message, { stripThinking });
			if (message === payload.message) return raw;
			return serialize(parsed.event, { ...payload, message });
		}
		default:
			return raw;
	}
}

/** Splits `buffer` on blank lines (`\n\n` or `\r\n\r\n`); returns complete events and the remaining tail. */
function splitEvents(buffer: string): { events: string[]; rest: string } {
	const events: string[] = [];
	let start = 0;
	for (;;) {
		const lf = buffer.indexOf("\n\n", start);
		const crlf = buffer.indexOf("\r\n\r\n", start);
		let end = -1;
		let sepLen = 0;
		if (lf !== -1 && (crlf === -1 || lf < crlf)) {
			end = lf;
			sepLen = 2;
		} else if (crlf !== -1) {
			end = crlf;
			sepLen = 4;
		}
		if (end === -1) break;
		events.push(buffer.slice(start, end + sepLen));
		start = end + sepLen;
	}
	return { events, rest: buffer.slice(start) };
}

/** Byte-level TransformStream that renumbers content blocks (and optionally strips thinking). */
export function createAnthropicSseNormalizer(opts: SseNormalizeOptions): TransformStream<Uint8Array, Uint8Array> {
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	const state: BlockState = { nextIndex: 0, current: -1, dropped: false };
	let buffer = "";

	const emit = (controller: TransformStreamDefaultController<Uint8Array>, rawEvent: string) => {
		const out = rewriteEvent(rawEvent.replace(/\r\n/g, "\n"), state, opts.stripThinking);
		if (out !== "") controller.enqueue(encoder.encode(out));
	};

	return new TransformStream<Uint8Array, Uint8Array>({
		transform(chunk, controller) {
			buffer += decoder.decode(chunk, { stream: true });
			const { events, rest } = splitEvents(buffer);
			buffer = rest;
			for (const event of events) emit(controller, event);
		},
		flush(controller) {
			buffer += decoder.decode();
			if (buffer === "") return;
			const trailing = buffer.endsWith("\n") ? buffer : `${buffer}\n`;
			emit(controller, `${trailing}\n`);
			buffer = "";
		},
	});
}
