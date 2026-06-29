export type DppEpdInfo = {
  declarationNumber: string;
  product: string;
  issueDate: string;
  validTo: string;
  programmeOperator: string;
  ownerContact: { person: string; phone: string; email: string };
  verifier: string;
  approvalStatus: string;
  standard: string;
};

export type DppDocument = {
  name: string;
  document: string;
  url: string;
  issuer?: { name: string; orgNr: string };
  epdInfo?: DppEpdInfo;
};


export type DppOrganisation = {
  name: string;
  orgNr: string;
  role: string;
  url?: string;
};

const orgUrls: Record<string, string> = {
  "Kinnarps AB": "https://www.kinnarps.com",
  "epd-global": "https://www.epd-norge.no",
};


export type DppMaterial = {
  name: string;
  category: string;
  kg?: number;
  percent?: number;
  recycledPercent?: number;
  source?: string;
};

export type DppClassification = {
  category: string;
  materials: string[];
};

export type DppRecyclability = {
  materialRecyclingPercent: number;
  energyRecoveryPercent: number;
  totalPercent: number;
  source: string;
};

export type DigitalProductPassport = {
  id: string;
  dppId: string;
  product: string;
  artNr?: string;
  model: string;
  modelPresentation?: string;
  series?: string;
  energyUse: string;
  footprint: number;
  recycledContent: number;
  presentation: string;
  businessRole: string;
  organisations: DppOrganisation[];
  documents: DppDocument[];
  materials: DppMaterial[];
  classification: DppClassification[];
  recyclability?: DppRecyclability;
};




type RawRow = {
  "DPP ID": string;
  "Energy Use": string;
  "Carbon Footprint": number;
  "Recycled Content": number;
  Product: string;
  "Art nr"?: string;
  Model: string;
  Presentation: string;
  "Org nr": string;
  "Business Role": string;
  Name: string;
  Document: string;
  "URL Link": string;
  ID: string;
  Organisation: string;
  "OrganisationOrg nr": string;
  Role: string;
  "Product SeriesPresentation"?: string;
  ModelPresentation?: string;
  "Role (document)Presentation"?: string;
  "Role (document)Org nr"?: string;
  "Document IssuerPresentation"?: string;
};


const raw: RawRow[] = [
  {
    "DPP ID": "DPP-00002",
    "Energy Use": "1668.04",
    "Carbon Footprint": 81.29,
    "Recycled Content": 21.58,
    Product: "Plus 6",
    Model: "7991ba47-992b-0c02-8a45-b47100bc2c1e",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Möbelfakta",
    Document: "0120200914",
    "URL Link":
      "https://www.kinnarps.se/mediacdn/79ff6f4f-b68a-4716-a33a-53abc54cbd74/b6f02ea8-d12a-574a-834c-7c1b066e8b1e/0120200914_plus6_Kinnarps_se.pdf",
    ID: "26545bed-5bb4-fd00-8a2f-b47200bf8062",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Plus 6",
    ModelPresentation: "6770",
  },
  {
    "DPP ID": "DPP-00002",
    "Energy Use": "1668.04",
    "Carbon Footprint": 81.29,
    "Recycled Content": 21.58,
    Product: "Plus 6",
    Model: "7991ba47-992b-0c02-8a45-b47100bc2c1e",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Sustainability Declaration",
    Document: "SD Plus 6",
    "URL Link":
      "https://www.kinnarps.se/mediacdn/79ff6f4f-b68a-4716-a33a-53abc54cbd74/43e3655e-26a2-556d-845c-1ca806c55673/Sustainability_Declaration_Kinnarps_Plus_6.pdf",
    ID: "26545bed-5bb4-fd00-8a2f-b47200bf8062",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Plus 6",
    ModelPresentation: "6770",
  },
  {
    "DPP ID": "DPP-00003",
    "Energy Use": "933",
    "Carbon Footprint": 84,
    "Recycled Content": 83,
    Product: "Plus 8",
    Model: "15e2a21e-ac2b-060a-9a63-b4720117a5a7",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Möbelfakta",
    Document: "0220200914",
    "URL Link":
      "https://www.kinnarps.se/mediacdn/79ff6f4f-b68a-4716-a33a-53abc54cbd74/50a17ae5-0401-561f-917f-0586d65ff057/0220200914_plus8_Kinnarps_se.pdf",
    ID: "ae07eb1c-6d87-6ddc-02d3-b4730090e13a",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Plus 8",
    ModelPresentation: "8770",
  },
  {
    "DPP ID": "DPP-00003",
    "Energy Use": "933",
    "Carbon Footprint": 84,
    "Recycled Content": 83,
    Product: "Plus 8",
    Model: "15e2a21e-ac2b-060a-9a63-b4720117a5a7",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Sustainability Declaration",
    Document: "SD Plus 8",
    "URL Link":
      "https://www.kinnarps.se/mediastudio/79ff6f4f-b68a-4716-a33a-53abc54cbd74/cf000d85-50d7-5f6a-93b8-6f13fe3d73d2/Sustainability_Declaration_Kinnarps_Plus_8.pdf",
    ID: "ae07eb1c-6d87-6ddc-02d3-b4730090e13a",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Plus 8",
    ModelPresentation: "8770",
  },
  {
    "DPP ID": "DPP-00004",
    "Energy Use": "933",
    "Carbon Footprint": 68,
    "Recycled Content": 24,
    Product: "Capella X",
    Model: "a73d4f70-e400-917a-c5ff-b475008edee1",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Certification",
    Document: "00016834",
    "URL Link":
      "https://www.kinnarps.se/mediacdn/79ff6f4f-b68a-4716-a33a-53abc54cbd74/0214101c-0ff9-5bda-bbd5-2b45ac87be38/KINNARPS_Capella_X_si%C3%A8ge_de_travail_Certificat_NF_Environnement_2025_2028.pdf",
    ID: "3a96dfc7-2c65-9678-c289-b47500a803d1",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Capella X",
    ModelPresentation: "Capella ESD",
  },
  {
    "DPP ID": "DPP-00004",
    "Energy Use": "933",
    "Carbon Footprint": 68,
    "Recycled Content": 24,
    Product: "Capella X",
    Model: "a73d4f70-e400-917a-c5ff-b475008edee1",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Environmental Product Declaration",
    Document: "NEPD-9216-8804",
    "URL Link":
      "https://www.epd-norge.no/getfile.php/1322181-1741010592/EPDer/M%C3%B8bler/Kontorm%C3%B8bler/NEPD-9216-8804_Capella-X-Task-Chair.pdf",
    ID: "3a96dfc7-2c65-9678-c289-b47500a803d1",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Capella X",
    ModelPresentation: "Capella ESD",
  },

  {
    "DPP ID": "DPP-00004",
    "Energy Use": "933",
    "Carbon Footprint": 68,
    "Recycled Content": 24,
    Product: "Capella X",
    Model: "a73d4f70-e400-917a-c5ff-b475008edee1",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Sustainability Declaration",
    Document: "SD Capella X",
    "URL Link":
      "https://www.kinnarps.se/mediacdn/79ff6f4f-b68a-4716-a33a-53abc54cbd74/dd9abd0b-df58-5eff-8839-855715e6d205/Sustainability_Declaration_Kinnarps_Capella_X.pdf",
    ID: "3a96dfc7-2c65-9678-c289-b47500a803d1",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Capella X",
    ModelPresentation: "Capella ESD",
  },
  {
    "DPP ID": "DPP-00002",
    "Energy Use": "1668.04",
    "Carbon Footprint": 81.29,
    "Recycled Content": 21.58,
    Product: "Plus 6",
    Model: "7991ba47-992b-0c02-8a45-b47100bc2c1e",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Certification",
    Document: "NEPD-3609-2539-EN",
    "URL Link":
      "https://www.kinnarps.se/mediastudio/79ff6f4f-b68a-4716-a33a-53abc54cbd74/097f8361-a00c-58b3-ace5-470a30652bde/NEPD-3609-2539_Task_Chair_Plus_%5B6%5D_%5B8%5D.pdf",
    ID: "26545bed-5bb4-fd00-8a2f-b47200bf8062",
    Organisation: "Kinnarps AB (556256-6736)",
    "OrganisationOrg nr": "556256-6736",
    Role: "Manufacturer",
    "Product SeriesPresentation": "Plus 6",
    ModelPresentation: "6770",
    "Role (document)Presentation": "epd-global (556256-6736)",
    "Role (document)Org nr": "556256-6736",
    "Document IssuerPresentation": "Issuer",
  },
];

const map = new Map<string, DigitalProductPassport>();
for (const row of raw) {
  const existing = map.get(row.ID);
  const issuerName = row["Role (document)Presentation"]?.replace(/\s*\([^)]+\)\s*$/, "");
  const doc: DppDocument = {
    name: row.Name,
    document: row.Document,
    url: row["URL Link"],
    issuer:
      issuerName && row["Document IssuerPresentation"] === "Issuer"
        ? { name: issuerName, orgNr: row["Role (document)Org nr"] ?? "" }
        : undefined,
  };
  const orgName = row.Organisation.replace(/\s*\([^)]+\)\s*$/, "");
  const mappedRole = row.Role === "Manufacturer" ? "Product Manufacturer" : row.Role;
  const org: DppOrganisation = {
    name: orgName,
    orgNr: row["OrganisationOrg nr"],
    role: mappedRole,
    url: orgUrls[orgName],
  };

  const issuerOrg: DppOrganisation | undefined = doc.issuer
    ? {
        name: doc.issuer.name,
        orgNr: doc.issuer.orgNr,
        role: "Document Issuer",
        url: orgUrls[doc.issuer.name],
      }
    : undefined;


  if (existing) {
    if (!existing.documents.some((d) => d.url === doc.url)) existing.documents.push(doc);
    if (!existing.organisations.some((o) => o.orgNr === org.orgNr && o.role === org.role))
      existing.organisations.push(org);
    if (
      issuerOrg &&
      !existing.organisations.some((o) => o.orgNr === issuerOrg.orgNr && o.role === issuerOrg.role)
    )
      existing.organisations.push(issuerOrg);

  } else {
    map.set(row.ID, {
      id: row.ID,
      dppId: row["DPP ID"],
      product: row.Product,
      artNr: row["Art nr"],
      model: row.Model,
      modelPresentation: row.ModelPresentation,
      series: row["Product SeriesPresentation"],
      energyUse: row["Energy Use"],
      footprint: row["Carbon Footprint"],
      recycledContent: row["Recycled Content"],
      presentation: row.Presentation,
      businessRole: row["Business Role"],
      organisations: issuerOrg ? [org, issuerOrg] : [org],
      documents: [doc],
      materials: [],
      classification: [],

    });

  }
}

// Allowed materials per product (from dpp_material.json — "KS: Product Material" export).
// Only these materials may be surfaced from the EPD source documents.
const allowedMaterials: Record<string, { name: string; category: string }[]> = {
  "Plus 6": [
    { name: "Glass", category: "Material" },
    { name: "Zinc", category: "Metal" },
    { name: "Cuttings", category: "Wood" },
    { name: "Synthetic Textile", category: "Textile" },
    { name: "Papper", category: "Material" },
    { name: "Oak", category: "Wood" },
    { name: "Wood Textile", category: "Textile" },
    { name: "Aluminium", category: "Metal" },
    { name: "MDF", category: "Wood" },
    { name: "Steel", category: "Metal" },
    { name: "Birch", category: "Wood" },
    { name: "Fiberglass", category: "Plastic" },
  ],
  "Plus 8": [
    { name: "Glass", category: "Material" },
    { name: "Zinc", category: "Metal" },
    { name: "Cuttings", category: "Wood" },
    { name: "Synthetic Textile", category: "Textile" },
    { name: "Papper", category: "Material" },
    { name: "Oak", category: "Wood" },
    { name: "Wood Textile", category: "Textile" },
    { name: "Aluminium", category: "Metal" },
    { name: "MDF", category: "Wood" },
    { name: "Steel", category: "Metal" },
    { name: "Birch", category: "Wood" },
    { name: "Fiberglass", category: "Plastic" },
  ],
  "Capella X": [
    { name: "Glass", category: "Material" },
    { name: "Zinc", category: "Metal" },
    { name: "Cuttings", category: "Wood" },
    { name: "Synthetic Textile", category: "Textile" },
    { name: "Papper", category: "Material" },
    { name: "Oak", category: "Wood" },
    { name: "Wood Textile", category: "Textile" },
    { name: "Aluminium", category: "Metal" },
    { name: "MDF", category: "Wood" },
    { name: "Steel", category: "Metal" },
    { name: "Birch", category: "Wood" },
    { name: "Fiberglass", category: "Plastic" },
  ],
};

// Composition values extracted from the EPD PDFs (only entries that correspond to
// materials present in the allowed list above are kept).
const epdMaterials: Record<string, DppMaterial[]> = {
  "Plus 6": [
    { name: "Aluminium", category: "Metal", kg: 1.92, percent: 10.43, recycledPercent: 75.99, source: "NEPD-3609-2539-EN" },
    { name: "Steel", category: "Metal", kg: 9.62, percent: 52.36, recycledPercent: 22.98, source: "NEPD-3609-2539-EN" },
    { name: "Zinc", category: "Metal", kg: 0.03, percent: 0.16, recycledPercent: 0, source: "NEPD-3609-2539-EN" },
    { name: "Fiberglass", category: "Plastic", kg: 0.28, percent: 1.55, recycledPercent: 100, source: "NEPD-3609-2539-EN" },
    // Cross-referenced from Sustainability Declaration Plus 6 PDF
    { name: "Steel", category: "Metal", kg: 9.6, percent: 53, source: "SD Plus 6" },
    { name: "Aluminium", category: "Metal", kg: 1.9, percent: 10, source: "SD Plus 6" },
    { name: "Synthetic Textile", category: "Textile", kg: 0.6, percent: 4, source: "SD Plus 6" },
  ],
  "Plus 8": [
    { name: "Aluminium", category: "Metal", kg: 1.92, percent: 10.43, recycledPercent: 75.99, source: "NEPD-3609-2539-EN" },
    { name: "Steel", category: "Metal", kg: 9.62, percent: 52.36, recycledPercent: 22.98, source: "NEPD-3609-2539-EN" },
    { name: "Zinc", category: "Metal", kg: 0.03, percent: 0.16, recycledPercent: 0, source: "NEPD-3609-2539-EN" },
    { name: "Fiberglass", category: "Plastic", kg: 0.28, percent: 1.55, recycledPercent: 100, source: "NEPD-3609-2539-EN" },
    // Cross-referenced from Sustainability Declaration Plus 8 PDF
    { name: "Steel", category: "Metal", kg: 12.7, percent: 60, source: "SD Plus 8" },
    { name: "Aluminium", category: "Metal", kg: 1.9, percent: 9, source: "SD Plus 8" },
    { name: "Synthetic Textile", category: "Textile", kg: 0.5, percent: 2, source: "SD Plus 8" },
  ],
  "Capella X": [
    { name: "Aluminium", category: "Metal", kg: 1.84, percent: 12.91, recycledPercent: 100, source: "NEPD-9216-8804" },
    { name: "Steel", category: "Metal", kg: 2.91, percent: 20.41, recycledPercent: 39.86, source: "NEPD-9216-8804" },
    { name: "Zinc", category: "Metal", kg: 0.18, percent: 1.26, recycledPercent: 0, source: "NEPD-9216-8804" },
    { name: "Synthetic Textile", category: "Textile", kg: 0.61, percent: 4.26, recycledPercent: 63.93, source: "NEPD-9216-8804" },
    // Cross-referenced from Sustainability Declaration Capella X PDF
    { name: "Steel", category: "Metal", kg: 3.0, percent: 21, source: "SD Capella X" },
    { name: "Aluminium", category: "Metal", kg: 1.8, percent: 13, source: "SD Capella X" },
    { name: "Zinc", category: "Metal", kg: 0.2, percent: 2, source: "SD Capella X" },
    { name: "Synthetic Textile", category: "Textile", kg: 0.5, percent: 3, source: "SD Capella X" },
  ],
};

// Recyclability extracted from Sustainability Declaration PDFs
const recyclability: Record<string, DppRecyclability> = {
  "Plus 6": { materialRecyclingPercent: 86, energyRecoveryPercent: 14, totalPercent: 100, source: "SD Plus 6" },
  "Plus 8": { materialRecyclingPercent: 83, energyRecoveryPercent: 17, totalPercent: 100, source: "SD Plus 8" },
  "Capella X": { materialRecyclingPercent: 90, energyRecoveryPercent: 10, totalPercent: 100, source: "SD Capella X" },
};

for (const p of map.values()) {
  const reg = allowedMaterials[p.product] ?? [];
  const allow = new Set(reg.map((m) => m.name));
  p.materials = (epdMaterials[p.product] ?? []).filter((m) => allow.has(m.name));
  p.recyclability = recyclability[p.product];

  const byCat = new Map<string, string[]>();
  for (const m of reg) {
    if (!byCat.has(m.category)) byCat.set(m.category, []);
    byCat.get(m.category)!.push(m.name);
  }
  p.classification = Array.from(byCat.entries())
    .map(([category, materials]) => ({ category, materials: materials.sort() }))
    .sort((a, b) => a.category.localeCompare(b.category));
}



export const passports: DigitalProductPassport[] = Array.from(map.values());

export const getPassport = (id: string) => passports.find((p) => p.id === id);

