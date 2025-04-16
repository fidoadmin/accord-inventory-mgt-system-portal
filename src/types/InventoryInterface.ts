import { ReactNode } from "react";

export interface InventoryInterface {
  Id: string;
  Name: String;
  Isexpirationdate: String;
  Created: String;
  Modified: string | null;
}
export interface InventoryDetail {
  Id: string;
  AgentName: string;
  BarCode: string;
  BatchNumber: string;
  BranchId: string;
  BranchName: string;
  CategoryId: string;
  CategoryName: string;
  CompanyId: string;
  CompanyName: string;
  ContainerId: string;
  ContainerType: string;
  PackSize: string;
  Created: string;
  InventoryDescriptionId: string;
  Description: string;
  ExpirationDate: string;
  HSCode: string;
  LastEditedBy: string;
  ManufacturerId: string;
  ManufactureDate: string | null;
  ManufacturerName: string;
  ModelNumber: string;
  Modified: string | null;
  PartNumber: string;
  Remarks: string;
  Shelf: string;
  ShortName: string;
  StatusName: string;
  Stock: number;
  SupplierId: string;
  SupplierName: string;
}

export interface InventoryData {
  Name: string;
  InventoryList: InventoryInterface[];
  TotalCount: number;
}

export interface InventoryDescriptionInterface {
  Id: string;
  Description: string;
  ManufacturerName: string;
  Stock: number;
  ShortName: string;
  ClientName: string;
  CategoryName: string;
  CategoryId: string;
  BranchName: string;
  CompanyName: string;
  AvailableQty: number;
  OnHold: number;
  ModelName?: string;
  PartNumber?: string;
}

export interface InventoryDetailForCategoryInterface {
  Id: string;
  Description: string;
  PartNumber: string;
  BarCode: string | null;
  Stock: number;
}

export interface InventoryPageDataInterface {
  CategoryName: string;
  CategoryId: string;
  DescriptionList: InventoryDescriptionInterface[];
  TotalCount: number;
}

export interface AddOrUpdateInventoryPayloadInterface {
  BarCode: string;
  BatchNumber: string;
  BranchId: string;
  CategoryId: string;
  CompanyId: string;
  ContainerId: string;
  ExpirationDate: string;
  HSCode: string;
  InventoryDescriptionId: string;
  ManufactureDate: string | null;
  ModelNumber: string;
  PartNumber: string;
  PurchaseOrderNumber: string;
  ProformaInvoiceNumber: string;
  InvoiceNumber: string | null;
  Remarks: string;
  Shelf: string;
  SerialNumber: string | null;
  Quantity: number;
  SupplierId: string | null;
}

export interface AddOrUpdateInventoryResponseInterface {
  id: string;
}

export interface deleteInventoryInterface {
  Id: string;
  AuthKey: string;
}

export interface DeleteInventoryDescriptionInterface {
  Id: string;
  AuthKey: string;
}

export interface InventoryListInterface {
  Id: string;
  ManufacturerName?: string;
  BarCode: string;
  BatchNumber: string;
  Description: string;
  ExpirationDate: string;
  PackSize: string;
  PartNumber: string;
  ShortName: string;
  Stock: number;
  Created: string;
  Quantity?: string;
  // InStock: string;
  // OutofStock: string;
}

export interface InventoryDetailInterface {
  SerialNumber: string;
  PackSize: string;
  ContainerType: string;
  Id: string;
  BarCode: string;
  BatchNumber: string;
  BranchId: string;
  BranchName: string;
  CategoryId: string;
  CategoryName: string;
  CompanyId: string;
  CompanyName: string;
  ContainerId: string;
  Created: string;
  Description: string;
  ExpirationDate: string;
  HSCode: string;
  InventoryDescriptionId: string;
  IsExpirationDate: boolean;
  LastEditedBy: string;
  ManufacturerId: string;
  ManufacturerName: string;
  ManufactureDate: string;
  ModelNumber: string;
  Modified: string | null;
  PartNumber: string;
  PurchaseOrderNumber: string;
  ProformaInvoiceNumber: string;
  InvoiceNumber: string;
  Remarks: string;
  Shelf: string;
  ShortName: string;
  StatusName: string;
  Quantity: number;
  SupplierId: string;
  SupplierName: string;
  TTNumber: string;
  LCNumber: string;
  Tender: boolean;
  OtherReferenceNumber: string;
}

export interface InventoryDescriptionDetailInterface {
  Id: string;
  Description: string;
  InventoryList: InventoryListInterface[];
  CategoryName: string;
  CategoryId: string;
  ShortName: string;
  ManufacturerName: string;
  ManufacturerId: string;
  ModelName?: string;
  PartNumber?: string;
}

export interface InventoryDescriptionForMaintenance {
  Id: string;
  ManufacturerName: string;
  ClientName: string;
  HasExpiryDate: boolean;
  HasBatchNumber: boolean;
  ShortName: string;
  CategoryId: string;
  Stock: number;
  CategoryName: string;
  Description: string;
  ModelName: string;
  PartNumber: string;
  Location: string;
  DivideQuantity: boolean;
}

export interface AddOrUpdateInventoryDescriptionPayloadInterface {
  Id?: string;
  Description?: string;
  CategoryName?: string;
  CategoryId?: string;
  ClientId?: string;
  ShortName?: string;
  ManufacturerName?: string;
  ManufacturerId?: string;
  ModelName?: string;
  PartNumber?: string;
  HasExpiryDate?: boolean;
  HasBatchNumber?: boolean;
  DivideQuantity?: boolean;
}

export interface AddOrUpdateInventoryDescriptionResponseInterface {
  id: string;
}
