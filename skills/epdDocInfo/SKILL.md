---
name: epdDocInfo
description: Extract document-level metadata from an Environmental Product Declaration (EPD) PDF — declaration/registration number, declaration owner (organisation, org number, contact person, phone, email), product, issue and valid-to dates, programme operator, and approval/signature status. Use when the user provides an EPD document and asks for its identifying information, header data, owner, validity dates, programme operator, or whether it is approved/signed.
---

# EPD Document Info

Extract and present the **document-level metadata** of an Environmental Product Declaration (EPD). This skill is about *the document itself* — who issued it, for what product, under which programme, and whether it is valid and approved — not the environmental impact numbers (LCA results) inside it.

EPDs follow ISO 14025 / EN 15804. The identifying metadata is usually on the cover page and the first 1–3 pages, often in a "General information" table.

## Input

A PDF path, supplied as the skill argument or in the request. If no path is given, ask the user for one.

## Fields to extract

Find each field below. Labels vary between programme operators — match on meaning, not exact wording. If a field cannot be found, output `Not found` (never guess).

| Field | Where to look / synonyms |
|-------|--------------------------|
| **Declaration number** | "Declaration number", "EPD number", "Reg. no", cover page |
| **Registration number** | "Registration number". **May be identical to the declaration number** — if only one number is present, report the same value for both and note they coincide. |
| **Declaration owner – organisation** | "Owner of the declaration", "Manufacturer", "Declaration holder", company name |
| **Declaration owner – organisation number** | "Org. no", "Organisation/company registration number", "VAT no" |
| **Declaration owner – contact person** | Named contact, "Contact" |
| **Declaration owner – phone** | Phone / tel number for the owner contact |
| **Declaration owner – email** | Email address for the owner contact |
| **Product** | Declared product name / description / functional unit subject |
| **Issue date** | "Date of issue", "Issued", "Publication date", "Approval date" |
| **Valid to** | "Valid until", "Valid to", "Expiry date" |
| **Programme operator** | "Programme operator", "Program operator" — name, and any address / website / contact given |
| **Approval / signature** | See **Approval check** below |

## Approval check (signature detection)

Determine whether the EPD appears **approved/verified**, and report the evidence — do not assert "approved" without basis. Look for:

- A **signature** — a handwritten-signature image, a digital-signature field, or a typed signature block near "Approved by", "Signed", "Verified by", or the verifier's name.
- An **independent verifier / verification statement** (EN 15804 requires third-party verification): the verifier's name, the verification body, and an "internal/external verification" checkbox.
- **Approval text** such as "Approved", "This declaration is approved", or an approval date alongside a name.

Report one of:
- **Approved (signature present)** — describe the evidence (e.g. "signature image present next to verifier name X", "digital signature field detected", "typed approval block with date").
- **Approved (no signature, approval text only)** — approval stated but no signature artefact found.
- **Not approved / no approval evidence found** — none of the above present.

Note the confidence: a scanned/image signature is detectable visually, but absence of a visible signature in extracted text does **not** prove the PDF is unsigned (it may carry an embedded cryptographic signature this skill cannot inspect). Say so when relevant.

## Procedure

1. **Read the PDF** with the Read tool using the provided path (cover + first few pages carry the metadata; scan the whole document if a field is missing early).
2. Extract every field in the table above, matching on meaning.
3. Run the **Approval check**.
4. Output using the format below.

## Output format

```markdown
# EPD document info — <Product or declaration number>

## Identification
| Field | Value |
|-------|-------|
| Declaration number | <value> |
| Registration number | <value> (identical to declaration number) |
| Product | <value> |
| Issue date | <value> |
| Valid to | <value> |

## Declaration owner
| Field | Value |
|-------|-------|
| Organisation | <value> |
| Organisation number | <value> |
| Contact person | <value> |
| Phone | <value> |
| Email | <value> |

## Programme operator
| Field | Value |
|-------|-------|
| Name | <value> |
| Details | <address / website / contact> |

## Approval
| Field | Value |
|-------|-------|
| Status | Approved (signature present) / Approved (no signature) / Not approved |
| Evidence | <what was found — verifier name, signature image, digital field, approval text/date> |
| Verifier | <independent verifier name / body, if any> |
```

## Related project

Part of the **Digital Product Passport** Lovable project (IKEA Industry / Kinnarps work) — https://trusty-passport-hub.lovable.app/ . Companion skills: `epdMatInfo` (material composition) and `sustainability-extract` (Kinnarps Sustainability Declaration data).

## Rules

- **Never fabricate.** Use `Not found` for any field absent from the document.
- Preserve values **verbatim** (dates in the document's own format, numbers as written).
- For the registration number, explicitly note when it is identical to the declaration number.
- Be honest and evidence-based on the approval status; distinguish "no visible signature" from "definitely unsigned".
- If the PDF is not an EPD (no declaration number / programme operator / EN 15804 framing), tell the user it doesn't match this skill instead of forcing an extraction.
