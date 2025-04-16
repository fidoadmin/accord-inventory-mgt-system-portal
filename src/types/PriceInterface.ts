export interface InventoryPrice {
    Id: string;
    Description: string;
    BatchNumber: string;
    ExpirationDate: string;
    LCNumber: string;
    InvoiceNumber: string;
    TTNumber: string;
    Amount: number;
    Created: string;
    Modified: string;
  }
  
  export interface AddOrUpdateInventoryPrice {
    Id?: string;
    Description?: string;
    BatchNumber?: string;
    ExpirationDate?: string;
    LCNumber?: string;
    InvoiceNumber?: string;
    TTNumber?: string;
    Amount?: number;
  }
  
  export interface AddOrUpdatePriceResponseInterface {
    id: string;
  }
  
