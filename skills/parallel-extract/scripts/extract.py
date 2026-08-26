#!/usr/bin/env python3
"""Parallel Extract API CLI — URLs → markdown/excerpts."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "parallel-common" / "scripts"))
from client import print_json, request  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Parallel Extract API")
    p.add_argument("urls", nargs="+", help="One or more public URLs")
    p.add_argument(
        "-o",
        "--objective",
        default=None,
        help="Focus objective for excerpts",
    )
    p.add_argument(
        "--full-content",
        action="store_true",
        help="Request full page content when supported",
    )
    args = p.parse_args()
    body: dict = {"urls": args.urls}
    if args.objective:
        body["objective"] = args.objective
    if args.full_content:
        body["full_content"] = True
    out = request("POST", "/v1/extract", body=body, timeout=120)
    results = out.get("results") or []
    compact_results = []
    for r in results if isinstance(results, list) else []:
        item = {
            "title": r.get("title"),
            "url": r.get("url"),
            "excerpts": (r.get("excerpts") or [])[:5],
        }
        for k in ("markdown", "content", "text", "full_content"):
            if isinstance(r.get(k), str):
                item[k + "_len"] = len(r[k])
                item[k + "_preview"] = r[k][:500]
                break
        compact_results.append(item)
    print_json(
        {
            "extract_id": out.get("extract_id"),
            "result_count": len(compact_results),
            "results": compact_results,
            "errors": out.get("errors"),
            "usage": out.get("usage"),
        }
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
