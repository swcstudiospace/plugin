import type { CliRunner, GreptileReview, MergeGate } from "./types.ts";

export interface GreptileOptions {
	run: CliRunner;
	bin?: string;
	minConfidence?: number;
	requiredForMerge?: boolean;
}

export interface GreptileWhoami {
	ok: boolean;
	signedIn: boolean;
	text: string;
}

export interface GreptileReviewInput {
	cwd?: string;
	base?: string;
}

const NOT_SIGNED_IN = /^Not signed in/m;

function unsignedReview(): GreptileReview {
	return { confidence: 0, comments: [], signedIn: false };
}

function parseReview(stdout: string): GreptileReview {
	if (NOT_SIGNED_IN.test(stdout)) return unsignedReview();
	try {
		const raw: unknown = JSON.parse(stdout.trim());
		if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return unsignedReview();
		const rec = raw as Record<string, unknown>;
		if (typeof rec.confidence !== "number" || !Number.isFinite(rec.confidence)) return unsignedReview();
		if (!Array.isArray(rec.comments)) return unsignedReview();
		return {
			confidence: rec.confidence,
			comments: rec.comments as GreptileReview["comments"],
			signedIn: true,
			raw,
		};
	} catch {
		return unsignedReview();
	}
}

export function createGreptile({
	run,
	bin = "greptile",
	minConfidence = 5,
	requiredForMerge = true,
}: GreptileOptions) {
	return {
		async whoami(): Promise<GreptileWhoami> {
			const result = await run(bin, ["whoami"]);
			return {
				ok: result.code === 0,
				signedIn: !NOT_SIGNED_IN.test(result.stdout),
				text: result.stdout,
			};
		},

		async review({ cwd, base }: GreptileReviewInput = {}): Promise<GreptileReview> {
			const args = ["review", "--json"];
			if (base !== undefined) args.push("-b", base);
			const result = await run(bin, args, cwd);
			return parseReview(result.stdout);
		},

		allowsMerge(review: GreptileReview): MergeGate {
			if (!requiredForMerge) {
				return { ok: true, reason: "greptile gate disabled", review };
			}
			if (!review.signedIn) {
				return { ok: false, reason: "greptile not signed in — run greptile login", review };
			}
			if (review.confidence < minConfidence) {
				return {
					ok: false,
					reason: `confidence ${review.confidence} below minimum ${minConfidence}`,
					review,
				};
			}
			if (review.comments.length > 0) {
				return { ok: false, reason: `${review.comments.length} Greptile comments open`, review };
			}
			return { ok: true, reason: "review clean", review };
		},
	};
}
