import rawData from "@/data/dppMain.json";
import type { DppExport, ExportColumn, Passport } from "./types";

const data = rawData as DppExport;
const objectSet = data.objectSets[0];

function value(record: Record<string, string | undefined>, ...keys: string[]) {
  for (const key of keys) {
    const found = record[key];
    if (found !== undefined && found !== "") return found;
  }
  return "";
}

export function getPassports(): Passport[] {
  if (!objectSet) return [];

  return objectSet.objects.map((record) => ({
    id: value(record, "DPP ID"),
    businessRole: value(record, "Business Role"),
    articleNumber: value(record, "Art nr"),
    productModel: value(record, "Product Model"),
    productSeries: value(record, "Product Series"),
    productName: value(record, "Product"),
    productConcept: value(record, "Name"),
    holder: {
      legalEntityName: value(record, "Legal EntityName"),
      organisationNumber: value(record, "Org nr"),
      ownershipType: value(record, "Ownership TypeName") || undefined,
      organisationType: value(record, "Organisation TypeName") || undefined,
    },
  }));
}

export function getPassport(id: string) {
  return getPassports().find((passport) => passport.id === id);
}

export function getExportMetadata(): {
  name: string;
  columns: ExportColumn[];
  totalSize: number;
} {
  return {
    name: objectSet?.metadata.name ?? "Digital Product Passport export",
    columns: objectSet?.metadata.columns ?? [],
    totalSize: data.totalSize,
  };
}
