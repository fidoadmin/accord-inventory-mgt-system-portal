export interface InventoryDetail {
  InventoryDescription: string;
  ShortName: string;
  Quantity: number;
  Date: string;
  ExpirationDate: string;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
}

export interface ReportInterface {
  Customer: string;
  InventoryDetails: InventoryDetail[];
}

export interface FOCReport {
  ClientName?: string;
  ChallanNumber: string;
  CompanyName: string;
  ChallanDate: string;
  CustomerName: string;
  Product: string;
  Quantity: number;
}
export interface ThresholdReport {
  Id: string;
  ClientName?: string;
  CategoryName: string;
  Description: string;
  Packsize: string;
  Unit: string;
  StockThreshold: number;
  AvailableStock: number;
  TotalStock: number;
  CheckoutQuantity: number;
  StockStatus: string;
}
export interface InvoiceNullReport {
  Id: string;
  ChallanNumber: string;
  ClientName?: string;
  SellerCompany: string;
  CompanyAddress: string;
  ChallanDate: string;
  CustomerName: string;
  Product: string;
  CategoryName: string;
  InvoiceNumber: string;
  Name: string;
  MobileNumber: string;
  EmailAddress: string;
  BillPendingDays: number;
}

export interface LostReport {
  Id: string;
  ClientName?: string;
  Description: string;
  Barcode: string;
  Created: string;
}
export interface DailySalesReport {
  Id: string;
  ClientName?: string;
  CategoryName: string;
  Description: string;
  CreationDate: string;
  TotalStock: number;
}

export interface SalesInfo {
  Id: string;
  ChallanNumber: string;
  ClientName?: string;
  ChallanDate: string;
  CustomerName: string;
  SellerCompany: string;
  CheckoutNumber: string;
  InvoiceNumber: string;
  InvoiceDate: string;
  Amount: string;
}
