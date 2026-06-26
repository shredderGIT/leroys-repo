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
    OrganisationOrgNr: "556256-6736" as never,
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
    orgNr: row["OrganisationOrg nr"],
    role: row.Role,
  };
  if (existing) {
    if (!existing.documents.some((d) => d.url === doc.url)) existing.documents.push(doc);
    if (!existing.organisations.some((o) => o.orgNr === org.orgNr && o.role === org.role))
      existing.organisations.push(org);
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
      organisations: [org],
      documents: [doc],
    });
  }
}

export const passports: DigitalProductPassport[] = Array.from(map.values());

export const getPassport = (id: string) => passports.find((p) => p.id === id);
