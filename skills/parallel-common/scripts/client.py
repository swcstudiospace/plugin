"""Shared Parallel Web Systems HTTP client for agent skills.

Auth: PARALLEL_API_KEY from env, or /root/.config/parallel/api.env, or Hermes .env.
Never print the key.
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

API_BASE = os.environ.get("PARALLEL_API_BASE", "https://api.parallel.ai").rstrip("/")


def load_api_key() -> str:
    key = (os.environ.get("PARALLEL_API_KEY") or "").strip()
    if key:
        return key
    for path in (
        Path("/root/.config/parallel/api.env"),
        Path("/root/.hermes/.env"),
        Path.home() / ".hermes" / ".env",
    ):
        if not path.is_file():
            continue
        try:
            for line in path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, _, v = line.partition("=")
                if k.strip() == "PARALLEL_API_KEY":
                    val = v.strip().strip('"').strip("'")
                    if val:
                        os.environ["PARALLEL_API_KEY"] = val
                        return val
        except OSError:
            continue
    raise SystemExit(
        "PARALLEL_API_KEY not set. Export it or put it in "
        "/root/.config/parallel/api.env (mode 600)."
    )


def request(
    method: str,
    path: str,
    *,
    body: dict[str, Any] | None = None,
    auth: str = "x-api-key",
    timeout: float = 120.0,
    extra_headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    """HTTP JSON request. auth: 'x-api-key' (default REST) or 'bearer' (Responses/Chat)."""
    key = load_api_key()
    url = path if path.startswith("http") else f"{API_BASE}{path}"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "hermes-parallel-skills/1.0",
    }
    if auth == "bearer":
        headers["Authorization"] = f"Bearer {key}"
    else:
        headers["x-api-key"] = key
    if extra_headers:
        headers.update(extra_headers)
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method.upper())
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            if not raw.strip():
                return {"_http_status": resp.status}
            out = json.loads(raw)
            if isinstance(out, dict):
                out.setdefault("_http_status", resp.status)
            return out
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(err_body) if err_body else {}
        except json.JSONDecodeError:
            parsed = {"raw": err_body[:2000]}
        raise SystemExit(
            f"Parallel API HTTP {e.code} {method} {path}: "
            f"{json.dumps(parsed, ensure_ascii=False)[:800]}"
        ) from None
    except urllib.error.URLError as e:
        raise SystemExit(f"Parallel API network error: {e}") from None


def dumps(obj: Any, *, indent: int = 2) -> str:
    return json.dumps(obj, indent=indent, ensure_ascii=False, default=str)


def print_json(obj: Any) -> None:
    # Strip internal keys for cleaner agent output
    if isinstance(obj, dict):
        obj = {k: v for k, v in obj.items() if not str(k).startswith("_")}
    sys.stdout.write(dumps(obj) + "\n")


def poll_until(
    get_fn,
    *,
    done_statuses: set[str],
    status_key: str = "status",
    interval_s: float = 2.0,
    max_wait_s: float = 600.0,
) -> dict[str, Any]:
    deadline = time.time() + max_wait_s
    last: dict[str, Any] = {}
    while time.time() < deadline:
        last = get_fn()
        st = str(last.get(status_key) or "").lower()
        if st in done_statuses:
            return last
        time.sleep(interval_s)
    last["_poll_timeout"] = True
    return last
