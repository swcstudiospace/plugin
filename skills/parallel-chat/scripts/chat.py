#!/usr/bin/env python3
"""Parallel Chat Completions API (beta, OpenAI-compatible)."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "parallel-common" / "scripts"))
from client import print_json, request  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Parallel Chat Completions (beta)")
    p.add_argument("message", help="User message")
    p.add_argument(
        "--model",
        default="speed",
        help="Model: speed | lite | base | core (research models slower)",
    )
    args = p.parse_args()
    body = {
        "model": args.model,
        "messages": [{"role": "user", "content": args.message}],
    }
    out = request(
        "POST",
        "/v1beta/chat/completions",
        body=body,
        auth="bearer",
        timeout=180,
    )
    choice0 = None
    ch = out.get("choices") or []
    if ch and isinstance(ch[0], dict):
        msg = ch[0].get("message") or {}
        choice0 = msg.get("content")
    print_json(
        {
            "id": out.get("id"),
            "model": out.get("model"),
            "content": choice0,
            "usage": out.get("usage"),
            "raw_choices_len": len(ch) if isinstance(ch, list) else 0,
        }
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
