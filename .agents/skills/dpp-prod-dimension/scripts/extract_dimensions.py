#!/usr/bin/env python3
"""Extract per-model dimensions from a product brochure PDF.

Usage:
    python3 extract_dimensions.py <PDF_PATH> [--output out.json]
                                              [--columns k1,k2,...]
                                              [--page N]

Works across brands. Auto-detects dimension tables via `pdfplumber`, infers
column headers, and normalises them to canonical keys (see HEADER_MAP).
For icon-only tables with no readable header row, pass `--columns` to supply
the left-to-right column order.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import pdfplumber

# --- Header normalisation ---------------------------------------------------

HEADER_MAP: list[tuple[re.Pattern, str]] = [
    (re.compile(r"seat\s*width|sitsbredd", re.I), "seat_width"),
    (re.compile(r"seat\s*height|sitsh[öo]jd", re.I), "seat_height"),
    (re.compile(r"seat\s*depth|sitsdjup", re.I), "seat_depth"),
    (re.compile(r"arm(rest)?\s*height|armst[öo]dsh[öo]jd", re.I), "armrest_height"),
    (re.compile(r"total\s*height|totalh[öo]jd", re.I), "total_height"),
    (re.compile(r"\bheight\b|\bh[öo]jd\b", re.I), "height"),
    (re.compile(r"\bwidth\b|\bbredd\b", re.I), "width"),
    (re.compile(r"\bdepth\b|\bdjup\b", re.I), "depth"),
    (re.compile(r"\blength\b|\bl[äa]ngd\b", re.I), "length"),
    (re.compile(r"diameter|\bø\b|⌀", re.I), "diameter"),
    (re.compile(r"\bweight\b|\bvikt\b", re.I), "weight"),
]

UNIT_RE = re.compile(r"\b(mm|cm|m|in|inch|kg|lb|lbs|g)\b\.?", re.I)
NUM_TOKEN_RE = re.compile(r"^(?:\d+(?:[.,]\d+)?-\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?|[–\-—])$")
MODEL_LINE_RE = re.compile(r"^([A-Z0-9][A-Z0-9/\-]{1,}(?:\s+[A-Z0-9/\-]+)*)\s+(\d.+)$")


def canonical_key(header: str) -> str:
    h = (header or "").strip()
    for pattern, key in HEADER_MAP:
        if pattern.search(h):
            return key
    slug = re.sub(r"[^a-z0-9]+", "_", h.lower()).strip("_")
    return slug or "col"


def detect_unit(text: str) -> str | None:
    m = UNIT_RE.search(text or "")
    if not m:
        return None
    u = m.group(1).lower().rstrip(".")
    return "in" if u == "inch" else u


def parse_cell(token: str):
    token = (token or "").strip().replace(",", ".")
    if token in ("", "–", "-", "—", "N/A", "n/a"):
        return None
    if re.match(r"^\d+(?:\.\d+)?-\d+(?:\.\d+)?$", token):
        lo, hi = token.split("-", 1)
        return {"min": _num(lo), "max": _num(hi)}
    if re.match(r"^\d+(?:\.\d+)?$", token):
        return {"value": _num(token)}
    return {"raw": token}


def _num(s: str):
    return int(s) if s.isdigit() else float(s)


# --- Page / table detection -------------------------------------------------

def page_looks_like_dimensions(text: str) -> bool:
    if not text:
        return False
    has_unit = bool(UNIT_RE.search(text)) or "Enhet" in text or "Unit" in text
    numeric_rows = 0
    for line in text.splitlines():
        toks = line.strip().split()
        if len(toks) >= 3 and sum(1 for t in toks if NUM_TOKEN_RE.match(t)) >= 3:
            numeric_rows += 1
    return has_unit and numeric_rows >= 1


def find_dimensions_pages(pdf) -> list[int]:
    hits = []
    for i, page in enumerate(pdf.pages):
        if page_looks_like_dimensions(page.extract_text() or ""):
            hits.append(i)
    return hits


def infer_header_index(table: list[list[str]]) -> int | None:
    for i, row in enumerate(table[:3]):
        cells = [c or "" for c in row]
        non_empty = [c for c in cells if c.strip()]
        if not non_empty:
            continue
        non_numeric = [c for c in non_empty if not NUM_TOKEN_RE.match(c.strip())]
        if len(non_numeric) / len(non_empty) > 0.5:
            return i
    return None


# --- Extraction paths -------------------------------------------------------

def extract_from_tables(page, page_unit: str | None, forced_columns: list[str] | None):
    rows: list[dict] = []
    for table in page.extract_tables() or []:
        if not table or len(table) < 2:
            continue
        header_idx = infer_header_index(table)
        if header_idx is None and not forced_columns:
            continue

        if forced_columns:
            keys = list(forced_columns)
            data_rows = table
        else:
            headers = [ (c or "").strip() for c in table[header_idx] ]
            # First column is the model label — skip it in the keys.
            keys = [canonical_key(h) for h in headers[1:]]
            data_rows = table[header_idx + 1 :]

        for row in data_rows:
            cells = [ (c or "").strip() for c in row ]
            if not any(cells):
                continue
            # First non-numeric cell is the model
            model = None
            data_cells = cells
            for idx, c in enumerate(cells):
                if c and not NUM_TOKEN_RE.match(c):
                    model = c
                    data_cells = cells[idx + 1 :]
                    break
            if not model:
                continue
            if len(data_cells) < len(keys):
                data_cells = data_cells + [""] * (len(keys) - len(data_cells))
            dims = {}
            for k, v in zip(keys, data_cells):
                key = f"{k}_{page_unit}" if page_unit and not k.endswith(("_mm", "_cm", "_m", "_in", "_kg", "_lb", "_g")) else k
                dims[key] = parse_cell(v)
            rows.append({"model": re.sub(r"\s+", " ", model), "variant": None, "unit": page_unit, "dimensions": dims})
    return rows


def extract_from_text(page, page_unit: str | None, forced_columns: list[str] | None):
    if not forced_columns:
        return []
    text = page.extract_text() or ""
    rows: list[dict] = []
    current_variant: str | None = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        # Variant-ish heading: no digits, 1–5 words, title-case-ish
        if not any(ch.isdigit() for ch in line) and 1 <= len(line.split()) <= 5 and line[:1].isupper():
            current_variant = line
            continue
        m = MODEL_LINE_RE.match(line)
        if not m:
            continue
        model = re.sub(r"\s+", " ", m.group(1))
        toks = m.group(2).split()
        if len(toks) != len(forced_columns):
            continue
        if not all(NUM_TOKEN_RE.match(t) for t in toks):
            continue
        dims = {k: parse_cell(t) for k, t in zip(forced_columns, toks)}
        rows.append({"model": model, "variant": current_variant, "unit": page_unit, "dimensions": dims})
    return rows


def extract(pdf_path: Path, forced_columns: list[str] | None, forced_page: int | None) -> list[dict]:
    with pdfplumber.open(pdf_path) as pdf:
        pages = [forced_page - 1] if forced_page else find_dimensions_pages(pdf)
        if not pages:
            raise SystemExit("No dimensions page detected. Try --page N or --columns.")
        all_rows: list[dict] = []
        for idx in pages:
            page = pdf.pages[idx]
            unit = detect_unit(page.extract_text() or "")
            rows = extract_from_tables(page, unit, forced_columns)
            if not rows:
                rows = extract_from_text(page, unit, forced_columns)
            all_rows.extend(rows)
        return all_rows


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pdf", type=Path)
    ap.add_argument("--output", type=Path)
    ap.add_argument("--columns", type=str, help="Comma-separated canonical column keys (icon-only tables)")
    ap.add_argument("--page", type=int, help="1-based page number to force")
    args = ap.parse_args()

    forced_columns = [c.strip() for c in args.columns.split(",")] if args.columns else None
    data = extract(args.pdf, forced_columns, args.page)
    payload = json.dumps(data, indent=2, ensure_ascii=False)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(payload, encoding="utf-8")
        print(f"Wrote {len(data)} rows to {args.output}", file=sys.stderr)
    else:
        print(payload)


if __name__ == "__main__":
    main()
