#!/usr/bin/env python3
"""Parallel Responses API (OpenAI-compatible live web research)."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "parallel-common" / "scripts"))
from client import print_json, request  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Parallel Responses API")
    p.add_argument("input", help="Question / prompt")
    p.add_argument(
        "--effort",
        default="low",
        choices=["low", "medium", "high"],
        help="reasoning.effort (default low for speed/cost)",
    )
    args = p.parse_args()
    body = {
        "model": "parallel",
        "input": args.input,
        "reasoning": {"effort": args.effort},
    }
    # Responses uses Bearer auth per docs
    out = request(
        "POST",
        "/v1/responses",
        body=body,
        auth="bearer",
        timeout=180 if args.effort != "high" else 300,
    )
    # Prefer output_text if present
    compact = {
        "id": out.get("id"),
        "model": out.get("model"),
        "output_text": out.get("output_text"),
        "output": out.get("output"),
        "usage": out.get("usage"),
    }
    if not compact["output_text"] and isinstance(out.get("output"), list):
        texts = []
        for item in out["output"]:
            if not isinstance(item, dict):
                continue
            for c in item.get("content") or []:
                if isinstance(c, dict) and c.get("text"):
                    texts.append(c["text"])
                elif isinstance(c, dict) and c.get("type") == "output_text":
                    texts.append(c.get("text") or "")
        if texts:
            compact["output_text"] = "\n".join(texts)
    print_json(compact)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
