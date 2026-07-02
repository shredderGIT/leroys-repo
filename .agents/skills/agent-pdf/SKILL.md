---
name: agent-pdf
description: Invoked as "AgentPDF" (or "run AgentPDF", "use AgentPDF"). Scans the shredderGIT/leroys-repo GitHub repo (DigitalProductPassport branch) for PDF documents, runs the project's PDF extraction skills against each one, cross-references results with the latest dpp_v*.json + dpp_material.json, and updates src/data/dpp.ts so the site reflects the newest data.
---

# AgentPDF

AgentPDF is the project's PDF-ingestion agent for the Digital Product Passport site. It is triggered any time the user says things like:

- "AgentPDF"
- "run AgentPDF"
- "invoke AgentPDF"
- "use AgentPDF to update"
- "have AgentPDF check for new documents"

When invoked, execute the workflow below end-to-end without asking for confirmation on each step (only ask if something is genuinely ambiguous, e.g. two candidate JSON versions).

## Source of truth

- GitHub repo: `https://github.com/shredderGIT/leroys-repo`
- Branch: `DigitalProductPassport`
- Only use PDFs and JSON files from this repo — never local project PDFs, never fabricated data.
- Product/material mapping JSON: the highest-numbered `dpp_v*.json` + latest `dpp_material.json` in the branch.

## Workflow

1. **Discover files.** List the branch contents via the GitHub API:
   `https://api.github.com/repos/shredderGIT/leroys-repo/git/trees/DigitalProductPassport?recursive=1`
   Collect every `.pdf` and the latest `dpp_v*.json` + `dpp_material.json`.

2. **Classify each PDF** by filename / first-page content:
   - `NEPD-*` → Environmental Product Declaration (EPD)
   - `*Sustainability*` → Sustainability Declaration
   - `*brochure*` / `*Product_brochure*` → Product brochure
   - `*Möbelfakta*` / `*cert*` → Certification
   - Anything else → generic document (still list it, ask user if unsure)

3. **Apply the matching skill(s):**
   | Document type | Skill(s) to run |
   |---|---|
   | EPD (NEPD-*) | `dpp-doc-info` (metadata) + `dpp-material-info` (material composition) |
   | Sustainability Declaration | `sustainability-extract` |
   | Product brochure | `dpp-prod-dimension` |
   | Certification | `dpp-doc-info` only |

   Never run `dpp-prod-dimension` on non-brochure PDFs (per project core rule).

4. **Cross-reference** every extracted material row against `dpp_material.json`. Drop rows whose material name is not in the whitelist for that product. Map products by article number / model against the latest `dpp_v*.json`.

5. **Diff against `src/data/dpp.ts`.** For each product, compare extracted `epdInfo`, `epdMaterials`, `sustainability`, `dimensions`, and `documents[]` to what is currently coded. Report:
   - New documents found in the repo but not on the site
   - Fields whose value in the PDF differs from what is on the site
   - Documents on the site whose source PDF is no longer in the repo

6. **Update `src/data/dpp.ts`** with the new/changed values, preserving existing structure and types (`DppEpdInfo`, `DppDocument`, `DppMaterial`, `DppDimensions`). Preserve verbatim number formatting from EPDs (decimal commas). Do not touch unrelated products.

7. **Report back** in chat with a short summary: which PDFs were scanned, which products were updated, and which fields changed. If no changes were needed, say so explicitly.

## Rules

- Only pull data from the GitHub repo above.
- Never fabricate values. If a field is not in the PDF, leave it as-is or mark `Not found`.
- Do not add new product entries unless the product also appears in the latest `dpp_v*.json`.
- Do not modify the theme, layout, or components — data updates only.
- Skill files live under `.workspace/skills/`; follow each skill's own SKILL.md for extraction rules.
