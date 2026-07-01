---
name: sustainability-extract
description: Extract and group environmental data from a product Sustainability Declaration / environmental-impact PDF (e.g. Kinnarps Sustainability Declaration). Reads the PDF and outputs three group markdown tables and structured JSON for DPP integration.
---

# Sustainability Declaration Extractor

Extract the environmental-impact data from a product **Sustainability Declaration** PDF and present it as clean, grouped markdown tables or structured JSON.

## Input

A PDF path, supplied as the skill argument or in the request. If no path is given, ask the user for one.

These declarations describe a single product's environmental profile. The three core data tables typically appear together on one page (often page 2), under the headings **MATERIAL CONTENT**, **RECYCLED MATERIAL**, and **RECYCLABILITY**. 

## Procedure

1. **Read the PDF** with the Read tool using the provided path.
2. **Identify the product** — capture the product name from the title page (e.g. "PLUS 6") and the brand if present.
3. **Locate the three sections.** Match headings case-insensitively; tolerate trailing colons and minor wording differences ("MATERIAL CONTENT", "RECYCLED MATERIAL", "RECYCLABILITY"). If a section is missing, note it explicitly.
4. **Extract each table's rows verbatim**, preserving the source's number format (e.g. decimal comma `9,6`, the `kg` unit, and `%`). Keep the **Total** row.
5. **Capture supporting figures** when present: `ENERGY VALUE` (e.g. 725 MJ) and `Total CO2` (e.g. 81 KG).
6. **Extract Chemical Data** (often page 3, heading **CHEMICAL DATA**). This is usually a list introduced by a qualifier such as "The product does not contain:". Capture the introductory qualifier and all rows.
7. **Capture disclaimers** attached to each section (the small-print "Disclaimer:" lines) — they qualify the numbers and must not be dropped.
8. **Output** using the format below. Support both markdown (default) and JSON formats.

## Output Format

### Default: Markdown Format

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

### JSON Format (for DPP Integration)

When explicitly requested or for programmatic use, output structured JSON matching this schema:

```json
{
  "productIdentifier": "Plus 6",
  "productName": "PLUS 6",
  "brand": "Kinnarps",
  "documentName": "Sustainability_Declaration_Kinnarps_Plus_6.pdf",
  "extractionDate": "2026-07-01T12:00:00Z",
  "data": {
    "materialContent": {
      "type": "table",
      "headers": ["Material", "Weight", "Share"],
      "rows": [
        ["Steel", "9.6 kg", "53 %"],
        ["Aluminum", "2.1 kg", "12 %"],
        ["Fabric", "4.5 kg", "25 %"],
        ["Plastic", "1.8 kg", "10 %"]
      ],
      "totals": {
        "weight": "18.0 kg",
        "share": "100 %"
      },
      "disclaimer": "Disclaimer text here..."
    },
    "recycledMaterial": {
      "type": "table",
      "headers": ["Type", "Weight", "Share"],
      "rows": [
        ["Post-consumer recycled content", "4.0 kg", "22 %"],
        ["Pre-consumer recycled content", "0 kg", "0 %"]
      ],
      "totals": {
        "weight": "4.0 kg",
        "share": "22 %"
      },
      "disclaimer": "Disclaimer text here..."
    },
    "recyclability": {
      "type": "table",
      "headers": ["Type", "Share"],
      "rows": [
        ["Material recycling", "86 %"],
        ["Energy recovery", "14 %"]
      ],
      "totals": {
        "share": "100 %"
      },
      "disclaimer": "Disclaimer text here..."
    },
    "keyFigures": {
      "energyValue": {
        "amount": 725,
        "unit": "MJ"
      },
      "totalCO2": {
        "amount": 81,
        "unit": "kg",
        "scope": "lifecycle"
      }
    },
    "chemicalData": {
      "qualifier": "The product does not contain:",
      "headers": ["Substance", "Status"],
      "rows": [
        ["Substances on REACH candidate list", "Not present"],
        ["Asbestos", "Not present"],
        ["Heavy metals", "Not present"],
        ["Phthalates", "Not present"],
        ["Brominated or halogenated flame retardants", "Not present"],
        ["PVC", "Not present"],
        ["Hexavalent chromium", "Not present"],
        ["Biocides", "Not present"]
      ]
    }
  },
  "metadata": {
    "extractionMethod": "PDF table extraction",
    "confidence": 0.95,
    "sourceFormat": "markdown",
    "pageReferences": {
      "materialContent": 2,
      "recycledMaterial": 2,
      "recyclability": 2,
      "chemicalData": 3
    },
    "notes": "All data successfully extracted from clearly labeled sections"
  }
}
```

#### JSON Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `productIdentifier` | string | Product code/SKU for DPP matching (e.g., "Plus 6", "DPP-00002") |
| `productName` | string | Full product name as it appears in the PDF |
| `brand` | string | Manufacturer/brand name |
| `documentName` | string | Original PDF filename |
| `extractionDate` | ISO 8601 | When the extraction was performed |
| `data.*.headers` | array | Column headers from each table |
| `data.*.rows` | array | Table rows with values preserved as strings |
| `data.*.totals` | object | Summary row values for each table |
| `data.*.disclaimer` | string | Any disclaimers or footnotes for the section |
| `data.keyFigures.totalCO2.amount` | number | Numeric CO2 value |
| `data.keyFigures.totalCO2.unit` | string | Unit of measurement (kg, ton, etc.) |
| `data.keyFigures.totalCO2.scope` | string | Type of emissions: "lifecycle", "production", "transport", "end-of-life", or "full scope" |
| `metadata.confidence` | number | 0-1 confidence score; 1.0 = all sections found and complete |
| `metadata.pageReferences` | object | Which PDF page each section was found on |

## Related Project

This skill supports the **Digital Product Passport** Lovable project (IKEA Industry / Kinnarps work) — https://trusty-passport-hub.lovable.app/ . The extracted Material Content, Recycled Material, and Recyclability tables populate the product passport's sustainability profile; the JSON output integrates directly with the DPP backend system.

### Integration Points

- **Product matching**: Uses `productIdentifier` to link data to DPP records in `dpp_v5.json`
- **Data versioning**: `extractionDate` enables tracking of declaration updates
- **Confidence scoring**: `metadata.confidence` allows filtering/flagging low-confidence extractions
- **Audit trail**: Full `metadata` preserves extraction details for reproducibility
- **Disambiguation**: If product name is ambiguous, cross-reference with known DPP products (Plus 6, Plus 8, Oberon, Capella X)

## Rules

- **Do not fabricate.** Only output values found in the document. If a number is unreadable or a section is missing, say so explicitly.
- **Preserve the source number format** (decimal commas, units, spacing around `%`). Do not convert or round unless converting for JSON numeric fields.
- Bold the **Total** rows in markdown so they read as subtotals.
- For JSON output, parse numeric values into the `amount` field but preserve the original string format in table rows.
- If the PDF is clearly a *different* kind of document (no material/recyclability data), tell the user it doesn't match this skill instead of forcing an extraction.
- If the user asks for an additional output (CSV, JSON, a combined table), produce the markdown tables first, then the requested format.
- CO2 scope should default to "lifecycle" unless the document specifies a narrower scope (e.g., "production only").
- When confidence is below 0.85 (due to missing sections or OCR issues), note the gaps explicitly in `metadata.notes`.
