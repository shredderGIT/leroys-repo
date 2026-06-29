---
name: sustainability-extract
description: Extract and group environmental data from a product Sustainability Declaration / environmental-impact PDF (e.g. Kinnarps Sustainability Declaration). Reads the PDF and outputs three grouped markdown tables — Material Content, Recycled Material, and Recyclability — plus key single figures. Use when the user provides such a PDF and asks to extract, group, summarize, or tabulate its material/recycled/recyclability data.
---

# Sustainability Declaration Extractor

Extract the environmental-impact data from a product **Sustainability Declaration** PDF and present it as clean, grouped markdown tables.

## Input

A PDF path, supplied as the skill argument or in the request. If no path is given, ask the user for one.

These declarations describe a single product's environmental profile. The three core data tables typically appear together on one page (often page 2), under the headings **MATERIAL CONTENT**, **RECYCLED MATERIAL**, and **RECYCLABILITY**.

## Procedure

1. **Read the PDF** with the Read tool using the provided path.
2. **Identify the product** — capture the product name from the title page (e.g. "PLUS 6") and the brand if present.
3. **Locate the three sections.** Match headings case-insensitively; tolerate trailing colons and minor wording differences ("MATERIAL CONTENT", "RECYCLED MATERIAL", "RECYCLABILITY"). If a section is absent, note it as *Not present* rather than inventing rows.
4. **Extract each table's rows verbatim**, preserving the source's number format (e.g. decimal comma `9,6`, the `kg` unit, and `%`). Keep the **Total** row.
5. **Capture supporting figures** when present: `ENERGY VALUE` (e.g. 725 MJ) and `Total CO2` (e.g. 81 KG).
6. **Extract Chemical Data** (often page 3, heading **CHEMICAL DATA**). This is usually a list introduced by a qualifier such as "The product does not contain:". Capture the introductory qualifier and each listed substance as its own row. Render the qualifier as a per-row **Status** so the meaning is never lost (e.g. each substance gets status *Not present*). If the section instead lists substances the product *does* contain, set the status accordingly. If absent, mark the section *Not present*.
7. **Capture disclaimers** attached to each section (the small-print "Disclaimer:" lines) — they qualify the numbers and must not be dropped.
8. **Output** using the format below.

## Output format

Begin with a one-line header naming the product, then the three grouped tables, then a Key figures block, then disclaimers.

```markdown
# Sustainability data — <Product name>

## Material Content
| Material | Weight | Share |
|----------|--------|-------|
| Steel    | 9,6 kg | 53 %  |
| ...      | ...    | ...   |
| **Total** | **18,2 kg** | **100 %** |

## Recycled Material
| Type | Weight | Share |
|------|--------|-------|
| Post-consumer recycled content | 4,0 kg | 22 % |
| Pre-consumer recycled content  | 0 kg   | 0 %  |
| **Total recycled content**     | **4,0 kg** | **22 %** |

## Recyclability
| Type | Share |
|------|-------|
| Material recycling | 86 % |
| Energy recovery    | 14 % |
| **Total recyclability** | **100 %** |

## Key figures
| Metric | Value |
|--------|-------|
| Energy value | 725 MJ |
| Total CO₂    | 81 kg  |

## Chemical Data
_The product does not contain:_

| Substance | Status |
|-----------|--------|
| Substances on REACH candidate list | Not present |
| Substances on Living Building Challenge Red List | Not present |
| Asbestos | Not present |
| Heavy metals | Not present |
| Phthalates | Not present |
| Brominated or halogenated flame retardants | Not present |
| PVC | Not present |
| Hexavalent chromium | Not present |
| Biocides | Not present |

## Disclaimers
- **Material Content:** <verbatim disclaimer text>
- **Recycled Material:** <verbatim disclaimer text>
```

## Related project

This skill supports the **Digital Product Passport** Lovable project (IKEA Industry / Kinnarps work) — https://trusty-passport-hub.lovable.app/ . The extracted Material Content, Recycled Material, and Recyclability tables feed that project's product passport data. Keep the output schema stable so it maps cleanly to the project's data model.

## Rules

- **Do not fabricate.** Only output values found in the document. If a number is unreadable or a section is missing, say so explicitly.
- **Preserve the source number format** (decimal commas, units, spacing around `%`). Do not convert or round.
- Bold the **Total** rows so they read as subtotals.
- If the PDF is clearly a *different* kind of document (no material/recyclability data), tell the user it doesn't match this skill instead of forcing an extraction.
- If the user asks for an additional output (CSV, JSON, a combined table), produce the markdown tables first, then the requested format.
