#!/usr/bin/env python3
"""Parallel Task API — create run and optionally wait for result."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "parallel-common" / "scripts"))
from client import poll_until, print_json, request  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Parallel Task API")
    sub = p.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("create", help="Create a task run")
    c.add_argument("input", help="Task input (string or JSON object string)")
    c.add_argument(
        "--processor",
        default="lite",
        choices=["lite", "base", "core", "pro", "ultra"],
        help="Processor tier (default lite for cheap smoke)",
    )
    c.add_argument(
        "--output-schema",
        default=None,
        help='Output schema text or JSON, e.g. "founding year"',
    )
    c.add_argument("--wait", action="store_true", help="Poll until complete and fetch result")
    c.add_argument("--timeout", type=float, default=600.0)

    g = sub.add_parser("get", help="Get run status")
    g.add_argument("run_id")

    r = sub.add_parser("result", help="Get run result (wait if still running)")
    r.add_argument("run_id")
    r.add_argument("--timeout", type=float, default=600.0)

    args = p.parse_args()

    if args.cmd == "create":
        inp: object = args.input
        if args.input.strip().startswith(("{", "[")):
            try:
                inp = json.loads(args.input)
            except json.JSONDecodeError:
                pass
        body: dict = {"input": inp, "processor": args.processor}
        if args.output_schema:
            schema = args.output_schema
            if schema.strip().startswith("{"):
                try:
                    body["task_spec"] = {"output_schema": json.loads(schema)}
                except json.JSONDecodeError:
                    body["task_spec"] = {"output_schema": schema}
            else:
                body["task_spec"] = {"output_schema": schema}
        created = request("POST", "/v1/tasks/runs", body=body, timeout=60)
        run_id = created.get("run_id") or created.get("id")
        if not args.wait:
            print_json(created)
            return 0
        if not run_id:
            print_json(created)
            return 1
        # Prefer result endpoint with long timeout when available
        try:
            result = request(
                "GET",
                f"/v1/tasks/runs/{run_id}/result",
                timeout=min(args.timeout, 3600),
            )
            print_json(result)
            return 0
        except SystemExit:
            # fallback poll status
            def _get():
                return request("GET", f"/v1/tasks/runs/{run_id}", timeout=30)

            st = poll_until(
                _get,
                done_statuses={"completed", "failed", "cancelled", "error"},
                max_wait_s=args.timeout,
            )
            print_json(st)
            return 0 if str(st.get("status", "")).lower() == "completed" else 2

    if args.cmd == "get":
        print_json(request("GET", f"/v1/tasks/runs/{args.run_id}", timeout=30))
        return 0

    if args.cmd == "result":
        try:
            print_json(
                request(
                    "GET",
                    f"/v1/tasks/runs/{args.run_id}/result",
                    timeout=min(args.timeout, 3600),
                )
            )
        except SystemExit:
            print_json(request("GET", f"/v1/tasks/runs/{args.run_id}", timeout=30))
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
