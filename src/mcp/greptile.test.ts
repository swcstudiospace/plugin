import { describe, expect, test } from "bun:test";
import { createGreptile } from "./greptile.ts";
import type { CliResult, CliRunner, GreptileReview } from "./types.ts";

function runner(impl: (bin: string, args: string[], cwd?: string) => CliResult | Promise<CliResult>): CliRunner {
	return async (bin, args, cwd) => impl(bin, args, cwd);
}

function reviewJson(confidence: number, comments: GreptileReview["comments"] = []): string {
	return JSON.stringify({ confidence, comments });
}

describe("createGreptile", () => {
	test("whoami treats Not signed in as a data result", async () => {
		const calls: { bin: string; args: string[]; cwd?: string }[] = [];
		const gt = createGreptile({
			run: runner((bin, args, cwd) => {
				calls.push({ bin, args, cwd });
				return { stdout: "Not signed in. Run greptile login\n", stderr: "", code: 0 };
			}),
		});
		const result = await gt.whoami();
		expect(calls).toEqual([{ bin: "greptile", args: ["whoami"] }]);
		expect(result).toEqual({
			ok: true,
			signedIn: false,
			text: "Not signed in. Run greptile login\n",
		});
	});

	test("review signed out or unparseable stdout is unsigned with zero confidence", async () => {
		const gt = createGreptile({
			run: runner(() => ({ stdout: "Not signed in\n", stderr: "", code: 1 })),
		});
		expect(await gt.review()).toEqual({ confidence: 0, comments: [], signedIn: false });

		const parseFail = createGreptile({
			run: runner(() => ({ stdout: "not-json", stderr: "", code: 0 })),
		});
		expect(await parseFail.review({ cwd: "/repo" })).toEqual({
			confidence: 0,
			comments: [],
			signedIn: false,
		});
	});

	test("review parses 5/5 with zero comments and passes the merge gate", async () => {
		const calls: { bin: string; args: string[]; cwd?: string }[] = [];
		const raw = { confidence: 5, comments: [] as GreptileReview["comments"] };
		const gt = createGreptile({
			run: runner((bin, args, cwd) => {
				calls.push({ bin, args, cwd });
				return { stdout: JSON.stringify(raw), stderr: "", code: 0 };
			}),
		});
		const review = await gt.review({ cwd: "/work/plugin", base: "main" });
		expect(calls).toEqual([
			{ bin: "greptile", args: ["review", "--json", "-b", "main"], cwd: "/work/plugin" },
		]);
		expect(review.signedIn).toBe(true);
		expect(review.confidence).toBe(5);
		expect(review.comments).toEqual([]);
		expect(review.raw).toEqual(raw);
		expect(gt.allowsMerge(review)).toEqual({
			ok: true,
			reason: "review clean",
			review,
		});
	});

	test("allowsMerge refuses 5/5 when comments are open", () => {
		const gt = createGreptile({
			run: runner(() => ({ stdout: "", stderr: "", code: 0 })),
		});
		const review: GreptileReview = {
			signedIn: true,
			confidence: 5,
			comments: [{ path: "src/a.ts", body: "fix this" }],
		};
		expect(gt.allowsMerge(review)).toEqual({
			ok: false,
			reason: "1 Greptile comments open",
			review,
		});
	});

	test("allowsMerge refuses confidence below 5", () => {
		const gt = createGreptile({
			run: runner(() => ({ stdout: reviewJson(4), stderr: "", code: 0 })),
		});
		const review: GreptileReview = { signedIn: true, confidence: 4, comments: [] };
		expect(gt.allowsMerge(review)).toEqual({
			ok: false,
			reason: "confidence 4 below minimum 5",
			review,
		});
	});

	test("allowsMerge is ok when the gate is disabled", async () => {
		const gt = createGreptile({
			run: runner(() => ({ stdout: "Not signed in\n", stderr: "", code: 1 })),
			requiredForMerge: false,
		});
		const review = await gt.review();
		expect(review.signedIn).toBe(false);
		expect(gt.allowsMerge(review)).toEqual({
			ok: true,
			reason: "greptile gate disabled",
			review,
		});
	});
});
