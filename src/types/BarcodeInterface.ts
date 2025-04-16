export interface BarcodeRequestInterface {
  InventoryDescriptionId: string;
  CategoryId: string;
  ContainerId: string;
  NumberOfBarcodes: number;
}

export type BarcodeResponseInterface = string[];
