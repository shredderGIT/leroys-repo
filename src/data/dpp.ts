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

// Shared EPD (NEPD-3609-2539-EN) covers Task Chair Plus[6]/[8]
const sharedEpd: DppEpd = {
  declarationNumber: "NEPD-3609-2539-EN",
  programOperator: "The Norwegian EPD Foundation (EPD-Norge)",
  standards: "ISO 14025, ISO 21930, EN 15804",
  pcr: "NPCR 026:2018 Part B for furniture",
  issued: "2022-06-30",
  validTo: "2027-06-30",
  yearOfStudy: "2022",
  declaredUnit: "1 pcs Task Chair Plus[6]/[8]",
  modulesDeclared: "A1, A2, A3, A4 (cradle to gate + transport)",
  referenceServiceLife: "10 years (5-year warranty)",
  totalWeightKg: 18.31,
  description:
    "High-performance Swedish task chair built for natural movement and active seating. Plus[6] uses the FreeFloat™ mechanism; Plus[8] uses Synchrone for a deeper backrest tilt.",
  productUrl: "https://www.kinnarps.com/products/seating/task-chairs/plus/",
  certifications: ["Möbelfakta", "GS", "NF Environnement", "NF OEC", "Nordic Swan (select)"],
  technicalStandards: [
    "EN 1335-1 Dimensions",
    "EN 1335-2 Safety requirements",
    "EN 1335-3 Safety test methods (110 kg)",
  ],
  fireStandards: ["EN 1021-1 (smouldering cigarette)", "EN 1021-2 (match flame)"],
  managementSystems: ["ISO 9001", "ISO 14001", "ISO 45001", "FSC® C010544"],
  manufacturer: {
    name: "Kinnarps AB",
    orgNr: "556256-6736",
    address: "Industrigatan, 521 88 Kinnarp, Sweden",
  },
  developer: {
    tool: "lca.tools EPD2020.11 (LCA.no AS)",
    author: "Isabell Vesterberg",
    reviewer: "Rickard Thil",
  },
  transport: {
    vehicle: "Truck 16–32 t, HVO, EURO 6",
    distanceKm: 300,
    fuelLPerTkm: 0.043,
    capacityUtil: "36.7% (incl. return)",
  },
  impacts: { gwp: 81.29, energyMJ: 1668.04, recycledPct: 21.58, recycledKg: 3.95 },
  materials: [
    { name: "Steel", kg: 9.62, share: 52.36, recycled: 22.98 },
    { name: "Aluminium", kg: 1.92, share: 10.43, recycled: 75.99 },
    { name: "Polyurethane (PUR)", kg: 1.89, share: 10.29, recycled: 0 },
    { name: "Polyamide w/ glass fibre (PAGF30)", kg: 1.89, share: 10.31, recycled: 0 },
    { name: "Polypropylene (PP)", kg: 1.61, share: 9.09, recycled: 0 },
    { name: "Wool textile", kg: 0.61, share: 3.32, recycled: 0 },
    { name: "Nylon (PA)", kg: 0.33, share: 1.77, recycled: 0 },
    { name: "Glass fibre", kg: 0.28, share: 1.55, recycled: 100 },
    { name: "POM", kg: 0.09, share: 0.51, recycled: 0 },
    { name: "Powder coating", kg: 0.03, share: 0.16, recycled: 0 },
    { name: "Zinc", kg: 0.03, share: 0.16, recycled: 0 },
    { name: "EPS", kg: 0.01, share: 0.03, recycled: 0 },
  ],
};

for (const p of passports) {
  p.epd = sharedEpd;
  if (!p.documents.some((d) => d.document === sharedEpd.declarationNumber)) {
    p.documents.unshift({
      name: "Environmental Product Declaration",
      document: sharedEpd.declarationNumber,
      url: "https://www.epd-norge.no/getfile.php/1325017-1665130556/EPDer/M%C3%B8bler/Sittem%C3%B8bler/NEPD-3609-2539-EN%20Task%20Chair%20Plus%5B6%5D%5B8%5D.pdf",
    });
  }
}

export const getPassport = (id: string) => passports.find((p) => p.id === id);

