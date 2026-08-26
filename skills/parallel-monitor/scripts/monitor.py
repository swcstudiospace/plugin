#!/usr/bin/env python3
"""Parallel Monitor API CLI — create/list/get/cancel (no real webhook required for list/get)."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "parallel-common" / "scripts"))
from client import print_json, request  # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(description="Parallel Monitor API")
    sub = p.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("create", help="Create event_stream monitor")
    c.add_argument("query", help="Natural language monitor query")
    c.add_argument("--frequency", default="1d", choices=["1h", "1d", "1w"])
    c.add_argument("--processor", default="lite", choices=["lite", "base"])
    c.add_argument(
        "--webhook-url",
        default=None,
        help="Optional webhook URL (omit for create without push)",
    )
    c.add_argument(
        "--dry-run-body",
        action="store_true",
        help="Print request body only (no API call)",
    )

    l = sub.add_parser("list", help="List monitors")
    g = sub.add_parser("get", help="Get monitor")
    g.add_argument("monitor_id")
    x = sub.add_parser("cancel", help="Cancel monitor")
    x.add_argument("monitor_id")

    args = p.parse_args()

    if args.cmd == "create":
        body: dict = {
            "type": "event_stream",
            "frequency": args.frequency,
            "processor": args.processor,
            "settings": {"query": args.query},
        }
        if args.webhook_url:
            body["webhook"] = {
                "url": args.webhook_url,
                "event_types": ["monitor.event.detected"],
            }
        if args.dry_run_body:
            print_json(body)
            return 0
        # Try GA path then alpha
        try:
            out = request("POST", "/v1/monitors", body=body, timeout=60)
        except SystemExit:
            out = request("POST", "/v1alpha/monitors", body=body, timeout=60)
        print_json(out)
        return 0

    if args.cmd == "list":
        try:
            print_json(request("GET", "/v1/monitors", timeout=30))
        except SystemExit:
            print_json(request("GET", "/v1alpha/monitors", timeout=30))
        return 0

    if args.cmd == "get":
        mid = args.monitor_id
        try:
            print_json(request("GET", f"/v1/monitors/{mid}", timeout=30))
        except SystemExit:
            print_json(request("GET", f"/v1alpha/monitors/{mid}", timeout=30))
        return 0

    if args.cmd == "cancel":
        mid = args.monitor_id
        for path in (
            f"/v1/monitors/{mid}/cancel",
            f"/v1alpha/monitors/{mid}/cancel",
            f"/v1/monitors/{mid}",
        ):
            method = "POST" if path.endswith("cancel") else "DELETE"
            try:
                print_json(request(method, path, timeout=30))
                return 0
            except SystemExit:
                continue
        raise SystemExit("cancel failed on all known endpoints")

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
