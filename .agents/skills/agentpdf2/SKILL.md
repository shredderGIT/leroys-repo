---
name: agentpdf2
description: Invoked as "AgentPDF2" (or "agentpdf2", "run agentpdf2"). Scans the shredderGIT/leroys-repo GitHub repo (DigitalProductPassport branch) for PDF documents ONLY, runs the project's PDF extraction skills against each one, and updates src/data/dpp.ts so the site reflects the newest data. Never cross-references any dpp_v*.json or dpp_material.json files.
---

# AgentPDF2

The PDF-only ingestion agent for the Digital Product Passport site. Triggered by:

- "agentpdf2"
- "run agentpdf2"
- "invoke agentpdf2"
- "AgentPDF2"

Execute the workflow end-to-end without asking for confirmation on each step.

## Source of truth

- GitHub repo: `https://github.com/shredderGIT/leroys-repo`
- Branch: `DigitalProductPassport`
- **PDF documents ONLY.** Do NOT read, fetch, parse, or cross-reference any `dpp_v*.json` or `dpp_material.json` file. Ignore them completely even if newer versions exist.
- Never use local project PDFs, never fabricate data.

## Workflow

1. **Discover PDFs.** List branch contents via:
   `https://api.github.com/repos/shredderGIT/leroys-repo/git/trees/DigitalProductPassport?recursive=1`
   Collect every `.pdf`. Skip all `.json` files.

2. **Classify each PDF** by filename / first-page content:
   - `NEPD-*` → Environmental Product Declaration (EPD)
   - `*Sustainability*` → Sustainability Declaration
   - `*brochure*` / `*Product_brochure*` → Product brochure
   - `*Möbelfakta*` / `*cert*` / `*NF*` → Certification
   - Anything else → generic document

3. **Apply the matching skill(s):**
   | Document type | Skill(s) to run |
   |---|---|
   | EPD (NEPD-*) | `dpp-doc-info` + `dpp-material-info` |
   | Sustainability Declaration | `sustainability-extract` |
   | Product brochure | `dpp-prod-dimension` |
   | Certification | `dpp-doc-info` only |

   Never run `dpp-prod-dimension` on non-brochure PDFs.

4. **Map PDFs to products by filename / PDF content only** (e.g. "Plus", "Capella_X", "Oberon"). Do NOT consult any JSON whitelist. Include every material row the PDF declares.

5. **Diff against `src/data/dpp.ts`.** For each product, compare extracted `epdInfo`, `epdMaterials`, `sustainability`, `dimensions`, and `documents[]` to what is coded. Report new documents, changed fields, and removed sources.

6. **Update `src/data/dpp.ts`** with new/changed values, preserving existing types (`DppEpdInfo`, `DppDocument`, `DppMaterial`, `DppDimensions`). Preserve verbatim number formatting (decimal commas). Do not touch unrelated products.

7. **Report back** in chat: PDFs scanned, products updated, fields changed. If nothing changed, say so.

## Rules

- Only pull data from the GitHub repo above, PDFs only.
- Never read `dpp_v*.json` or `dpp_material.json`.
- Never fabricate values. If a field is not in the PDF, leave it as-is.
- Do not modify theme, layout, or components — data updates only.
