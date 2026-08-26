#!/usr/bin/env python3
"""Parallel FindAll + Entity Search CLI."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "parallel-common" / "scripts"))
from client import poll_until, print_json, request  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Parallel FindAll / Entity Search")
    sub = p.add_subparsers(dest="cmd", required=True)

    e = sub.add_parser("entity-search", help="Fast synchronous people/company search")
    e.add_argument("objective")
    e.add_argument(
        "--entity-type",
        default="companies",
        help="Required by API: companies | people | … (default companies)",
    )

    i = sub.add_parser("ingest", help="NL objective → structured FindAll schema")
    i.add_argument("objective")

    r = sub.add_parser("run", help="Create FindAll run from objective (ingest+run if needed)")
    r.add_argument("objective")
    r.add_argument("--wait", action="store_true")
    r.add_argument("--timeout", type=float, default=900.0)

    s = sub.add_parser("status", help="Get FindAll run status")
    s.add_argument("findall_id")

    res = sub.add_parser("result", help="Get FindAll candidates snapshot")
    res.add_argument("findall_id")

    args = p.parse_args()

    if args.cmd == "entity-search":
        body = {
            "objective": args.objective,
            "entity_type": args.entity_type,
        }
        out = request("POST", "/v1beta/findall/entity-search", body=body, timeout=60)
        print_json(out)
        return 0

    if args.cmd == "ingest":
        out = request(
            "POST",
            "/v1beta/findall/ingest",
            body={"objective": args.objective},
            timeout=60,
        )
        print_json(out)
        return 0

    if args.cmd == "run":
        # Prefer create run with objective if API accepts; else ingest then create
        # Docs: ingest then create run — try create-findall-run with objective first
        body = {"objective": args.objective}
        try:
            created = request("POST", "/v1beta/findall/runs", body=body, timeout=60)
        except SystemExit:
            ingested = request(
                "POST",
                "/v1beta/findall/ingest",
                body={"objective": args.objective},
                timeout=60,
            )
            # pass through schema fields
            run_body = {k: v for k, v in ingested.items() if not str(k).startswith("_")}
            created = request("POST", "/v1beta/findall/runs", body=run_body, timeout=60)
        fid = (
            created.get("findall_id")
            or created.get("id")
            or created.get("run_id")
        )
        if not args.wait or not fid:
            print_json(created)
            return 0

        def _st():
            return request("GET", f"/v1beta/findall/runs/{fid}", timeout=30)

        st = poll_until(
            _st,
            done_statuses={"completed", "failed", "cancelled", "error", "done"},
            max_wait_s=args.timeout,
            interval_s=5.0,
        )
        # try result snapshot
        try:
            snap = request("GET", f"/v1beta/findall/runs/{fid}/result", timeout=60)
            print_json({"status": st, "result": snap})
        except SystemExit:
            print_json(st)
        return 0

    if args.cmd == "status":
        print_json(request("GET", f"/v1beta/findall/runs/{args.findall_id}", timeout=30))
        return 0

    if args.cmd == "result":
        print_json(
            request("GET", f"/v1beta/findall/runs/{args.findall_id}/result", timeout=60)
        )
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
