---
name: dpp-prod-dimension
description: Extracts per-model product dimensions and weights from product brochure PDFs (furniture, appliances, hardware, etc.). Use when the user provides a product brochure/spec-sheet PDF and asks for dimensions, sizes, measurements, weight, width, height, depth, length, diameter, or seat/arm heights per model or variant. Works across brands — auto-detects tables, header labels, units (mm, cm, m, in, kg, lb), and range values.
---

# Product brochure dimensions extractor

Product brochures (furniture, appliances, fixtures) usually publish a
per-model dimensions table. Layouts vary by brand: some use text headers
(`Seat height`, `Width`), some use icon headers with a caption row that
names the unit (`Unit: mm`, `Enhet mm.`). This skill targets that general
family — not one brand — by combining `pdfplumber` table extraction with a
header-inference pass and a fallback text-line parser for icon-only tables.

## What it extracts

For each data row: a `model` code/name, an optional `variant` group heading,
the detected `unit`, and a `dimensions` object keyed by normalised field
names. Values are one of:

- `{ "value": 450 }` — single measurement
- `{ "min": 380, "max": 470 }` — adjustable range
- `null` — cell was `–`, `-`, `—`, or empty
- `{ "raw": "..." }` — unparseable, preserved verbatim

## Field-name normalisation

Header text is lowercased, stripped of units, and mapped to canonical keys:

| Header contains                          | Canonical key         |
|------------------------------------------|-----------------------|
| `seat width` / `sitsbredd`               | `seat_width`          |
| `seat height` / `sitshöjd`               | `seat_height`         |
| `seat depth` / `sitsdjup`                | `seat_depth`          |
| `arm height` / `armstödshöjd`            | `armrest_height`      |
| `total height` / `totalhöjd` / `height`  | `total_height`        |
| `width` / `bredd`                        | `width`               |
| `depth` / `djup`                         | `depth`               |
| `length` / `längd`                       | `length`              |
| `diameter` / `ø`                         | `diameter`            |
| `weight` / `vikt`                        | `weight`              |

Unknown headers become `snake_case` of the raw header. The unit suffix
(`_mm`, `_cm`, `_kg`, …) is appended when a table-wide unit is detected.

For **icon-only tables** where the extractor cannot read headers, pass
`--columns key1,key2,...` to supply the left-to-right column order. This
covers legacy Kinnarps Capella brochures (`seat_width_mm,seat_height_mm,
seat_depth_mm,armrest_height_mm,total_height_mm,width_mm,depth_mm`).

## How to run

```bash
code--copy knowledge://skill/dpp-prod-dimension/scripts/extract_dimensions.py /tmp/extract_dimensions.py
code--exec python3 -m pip install --no-cache-dir pdfplumber -q
code--exec python3 /tmp/extract_dimensions.py <PDF_PATH> [--output out.json] [--columns k1,k2,...] [--page N]
```

Flags:
- `--output PATH` — write JSON to file instead of stdout.
- `--columns LIST` — comma-separated canonical keys, in left-to-right order,
  when the brochure uses icon-only headers.
- `--page N` — 1-based page to force (skip auto-detection).

## How the script works

1. Opens the PDF with `pdfplumber` and either uses `--page` or scans every
   page for a dimensions signature: a unit token (`mm`, `cm`, `kg`, `Enhet`,
   `Unit`) plus at least one row of ≥3 numeric tokens.
2. Runs `page.extract_tables()`. For each candidate table:
   - Infers the header row (first row where >50% of cells are non-numeric text).
   - Normalises headers via the map above.
   - Parses each remaining row: first non-numeric cell → `model`; remaining
     cells → `dimensions` via `parse_cell`.
3. If no table is found, falls back to a text-line parser: any line starting
   with a model-code pattern (`^[A-Z0-9][A-Z0-9/\- ]{2,}\s+\d`) followed by
   N numeric tokens is treated as a row and mapped via `--columns` (required
   in this fallback).
4. Emits a JSON array to stdout or `--output`.

## Output shape

```json
[
  {
    "model": "CFM/CSM 110 CLA",
    "variant": "Capella Classic",
    "unit": "mm",
    "dimensions": {
      "seat_width_mm":     { "value": 450 },
      "seat_height_mm":    { "min": 380, "max": 470 },
      "armrest_height_mm": null,
      "width_mm":          { "value": 620 }
    }
  }
]
```

## Notes and limits

- Weight ratings buried in prose (e.g. "rated for 130 kg users") are not
  extracted — this skill only reads tables/data rows. Ask the user if they
  want a prose pass added.
- Multi-unit tables (e.g. mm for sizes + kg for weight) are handled per
  column via the header-inference pass; icon-only tables need `--columns`.
- Non-Latin scripts and heavily image-based brochures may need an OCR
  pre-pass (out of scope here).
