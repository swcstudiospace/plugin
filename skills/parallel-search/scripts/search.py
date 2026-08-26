#!/usr/bin/env python3
"""Parallel Search API CLI — objective + optional queries."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "parallel-common" / "scripts"))
from client import print_json, request  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Parallel Search API")
    p.add_argument("objective", help="Natural language research objective")
    p.add_argument(
        "-q",
        "--query",
        action="append",
        dest="queries",
        default=[],
        help="Optional search_queries (repeatable)",
    )
    p.add_argument("--mode", default=None, help="Optional search mode if supported")
    p.add_argument("--max-results", type=int, default=None)
    args = p.parse_args()
    body: dict = {"objective": args.objective}
    if args.queries:
        body["search_queries"] = args.queries
    if args.mode:
        body["mode"] = args.mode
    if args.max_results:
        body["max_results"] = args.max_results
    out = request("POST", "/v1/search", body=body, timeout=90)
    # compact view for agents
    results = out.get("results") or []
    compact = {
        "search_id": out.get("search_id"),
        "result_count": len(results) if isinstance(results, list) else None,
        "results": [
            {
                "title": r.get("title"),
                "url": r.get("url"),
                "excerpts": (r.get("excerpts") or [])[:3],
            }
            for r in (results if isinstance(results, list) else [])[:15]
        ],
        "usage": out.get("usage"),
        "warnings": out.get("warnings"),
    }
    print_json(compact)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
