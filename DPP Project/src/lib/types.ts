export interface ExportColumn {
  id: string;
  title: string;
  index: number;
  dataType: string;
  calculated: boolean;
  path: string[];
}

export interface DppExport {
  paged: boolean;
  page: number;
  pageSize: number;
  totalSize: number;
  totalPages: number;
  objectSets: Array<{
    metadata: {
      id: string;
      name: string;
      attributeNames: string[];
      columns: ExportColumn[];
    };
    objects: Record<string, string | undefined>[];
  }>;
}

export interface Passport {
  id: string;
  businessRole: string;
  articleNumber: string;
  productModel: string;
  productSeries: string;
  productName: string;
  productConcept: string;
  holder: {
    legalEntityName: string;
    organisationNumber: string;
    ownershipType?: string;
    organisationType?: string;
  };
}
