export type DppDocument = {
  name: string;
  document: string;
  url: string;
};

export type DppOrganisation = {
  name: string;
  orgNr: string;
  role: string;
};

export type DppMaterial = { name: string; kg: number; share: number; recycled: number };

export type DppEpd = {
  declarationNumber: string;
  programOperator: string;
  standards: string;
  pcr: string;
  issued: string;
  validTo: string;
  yearOfStudy: string;
  declaredUnit: string;
  modulesDeclared: string;
  referenceServiceLife: string;
  totalWeightKg: number;
  description: string;
  productUrl: string;
  certifications: string[];
  technicalStandards: string[];
  fireStandards: string[];
  managementSystems: string[];
  manufacturer: { name: string; orgNr: string; address: string };
  developer: { tool: string; author: string; reviewer: string };
  transport: { vehicle: string; distanceKm: number; fuelLPerTkm: number; capacityUtil: string };
  impacts: { gwp: number; energyMJ: number; recycledPct: number; recycledKg: number };
  materials: DppMaterial[];
};

export type DigitalProductPassport = {
  id: string;
  product: string;
  artNr?: string;
  model: string;
  series?: string;
  energyUse: string;
  footprint: number;
  recycledContent: number;
  presentation: string;
  businessRole: string;
  organisations: DppOrganisation[];
  documents: DppDocument[];
  epd?: DppEpd;
};


const raw = [
  {
    ID: "6c78323f-bb4f-0887-9a3f-b4730090314a",
    "Energy Use": "933",
    Footprint: 84,
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
    Organisation: "Kinnarps AB (556256-6736)",
    OrganisationOrgNr: "556256-6736",
    Role: "Manufacturer",
  },
  {
    ID: "6c78323f-bb4f-0887-9a3f-b4730090314a",
    "Energy Use": "933",
    Footprint: 84,
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
    Organisation: "Kinnarps AB (556256-6736)",
    OrganisationOrgNr: "556256-6736",
    Role: "Manufacturer",
  },
  {
    ID: "08d5cdfd-6715-2bac-55d4-b472009a81fc",
    "Energy Use": "1668.04",
    Footprint: 81.29,
    "Recycled Content": 21.58,
    Product: "Plus 6",
    "Art nr": "2BScgD7enQ",
    Model: "7991ba47-992b-0c02-8a45-b47100bc2c1e",
    Series: "Plus 6",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Sustainability Declaration",
    Document: "SD Plus 6",
    "URL Link":
      "https://www.kinnarps.se/mediacdn/79ff6f4f-b68a-4716-a33a-53abc54cbd74/43e3655e-26a2-556d-845c-1ca806c55673/Sustainability_Declaration_Kinnarps_Plus_6.pdf",
    Organisation: "Kinnarps AB (556256-6736)",
    OrganisationOrgNr: "556256-6736",
    Role: "Manufacturer",
  },
  {
    ID: "08d5cdfd-6715-2bac-55d4-b472009a81fc",
    "Energy Use": "1668.04",
    Footprint: 81.29,
    "Recycled Content": 21.58,
    Product: "Plus 6",
    "Art nr": "2BScgD7enQ",
    Model: "7991ba47-992b-0c02-8a45-b47100bc2c1e",
    Series: "Plus 6",
    Presentation: "Kinnarps AB (556256-6736)",
    "Org nr": "556256-6736",
    "Business Role": "Holder",
    Name: "Möbelfakta",
    Document: "0120200914",
    "URL Link":
      "https://www.kinnarps.se/mediacdn/79ff6f4f-b68a-4716-a33a-53abc54cbd74/b6f02ea8-d12a-574a-834c-7c1b066e8b1e/0120200914_plus6_Kinnarps_se.pdf",
    Organisation: "Kinnarps AB (556256-6736)",
    OrganisationOrgNr: "556256-6736",
    Role: "Manufacturer",
  },
];

const map = new Map<string, DigitalProductPassport>();
for (const row of raw) {
  const existing = map.get(row.ID);
  const doc: DppDocument = {
    name: row.Name,
    document: row.Document,
    url: row["URL Link"],
  };
  const org: DppOrganisation = {
    name: row.Organisation.replace(/\s*\([^)]+\)\s*$/, ""),
    orgNr: row.OrganisationOrgNr,
    role: row.Role,
  };
  if (existing) {
    if (!existing.documents.some((d) => d.url === doc.url)) existing.documents.push(doc);
    if (!existing.organisations.some((o) => o.orgNr === org.orgNr && o.role === org.role))
      existing.organisations.push(org);
  } else {
    map.set(row.ID, {
      id: row.ID,
      product: row.Product,
      artNr: (row as { "Art nr"?: string })["Art nr"],
      model: row.Model,
      series: (row as { Series?: string }).Series,
      energyUse: row["Energy Use"],
      footprint: row.Footprint,
      recycledContent: row["Recycled Content"],
      presentation: row.Presentation,
      businessRole: row["Business Role"],
      organisations: [org],
      documents: [doc],
    });
  }
}

export const passports: DigitalProductPassport[] = Array.from(map.values());

export const getPassport = (id: string) => passports.find((p) => p.id === id);
