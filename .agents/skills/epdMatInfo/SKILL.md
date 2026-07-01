---
name: epdMatInfo
description: Extract the material composition table from an Environmental Product Declaration (EPD) PDF — each material with its weight (kg), weight percentage (%), recycled share in material (kg), and recycled share in material (%), plus the Total row. Use when the user provides an EPD and asks for its materials / material content / composition / recycled-content breakdown by weight and percentage.
---

# EPD Material Info

Extract the **material composition table** from an Environmental Product Declaration (EPD) and present it as a single clean markdown table. Scope is intentionally narrow: **materials and their weight, percentage, and recycled share only** — no LCA impact results, no data-quality/source table, no other metadata.

## Input

A PDF path, supplied as the skill argument or in the request. If no path is given, ask the user for one.

## Locating the right table

The target table appears in the **Product** / "Product specification" section (typically page 3 in EPD-Norge / NEPD documents). Its header columns are:

| Materials | kg | % | Recycled share in material (kg) | Recycled share in material (%) |

It ends with a **Total** row (the Total usually has kg and % but may leave the recycled-share-% cell blank).

**Do not confuse it** with the *Data quality* table (often page 4) which is also headed "Materials" but has columns **Source / Data quality / Year** — that table is NOT the target. Match on the presence of the kg / % / recycled-share columns.

## Procedure

1. **Read the PDF** with the Read tool using the provided path.
2. **Find the material composition table** by its column signature (kg, %, recycled share in material kg, recycled share in material %).
3. **Extract every material row verbatim**, preserving the source number format (decimal comma, e.g. `2,87`). Keep the **Total** row; leave any blank cell blank (do not fill it with 0).
4. **Do not** pull rows from the data-quality table or any LCA results table.
5. **Output** using the format below.

## Output format

```markdown
# Material composition — <Product name> (<Declaration number>)

| Material | Weight (kg) | Weight (%) | Recycled share (kg) | Recycled share (%) |
|----------|-------------|------------|---------------------|--------------------|
| Metal - Steel low alloy | 0,86 | 6,01 | 0,86 | 100,00 |
| Plastic - Nylon (PA) | 2,87 | 20,13 | 0,00 | 0,00 |
| ... | ... | ... | ... | ... |
| **Total** | **14,25** | **100,00** | **3,39** |  |
```

## Related project

Part of the **Digital Product Passport** Lovable project (IKEA Industry / Kinnarps work) — https://trusty-passport-hub.lovable.app/ . Companion skills: `epdDocInfo` (document metadata) and `sustainability-extract` (Kinnarps Sustainability Declaration data).

## Rules

- **Never fabricate.** Extract only rows present in the material composition table. Use `Not found` only if the whole table is absent.
- **Preserve the source number format** (decimal commas, two decimals as written). Do not convert, round, or reformat numbers.
- Keep material names exactly as written (e.g. "Metal - Steel low alloy", "Plastic - Polyoxymethylene (POM)").
- Bold the **Total** row. Leave genuinely empty cells empty rather than inserting `0` or `–`.
- If the document contains variant- or option-specific tables too, extract the main declared-product table by default and mention that variant tables exist; extract those only if the user asks.
- If the PDF is not an EPD with a material composition table, say so instead of forcing an extraction.
