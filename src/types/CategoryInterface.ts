export interface AddOrUpdateCategoryInterface {
  CategoryId: string;
}
export interface CategoryListInterface {
  Id: string;
  Name: string;
  ClientName: string;
  HasExpirationDate: boolean;
  HasManufactureDate: boolean;
  HasModelName: boolean;
  HasPartNumber: boolean;
  AllowExpiredInventory: boolean;
  ShowSize: boolean;
  Created: string;
  Modified: string;
}

export interface DeleteCategoryDetailInterface {
  Id: string;
  AuthKey: string;
}
export interface CategoryDetailInterface {
  Id: string;
  Name: string;
  Description: string;
  Isexpirationdate: boolean;
  HasModelName: boolean;
  HasPartNumber: boolean;
  Created: string;
  Modified: string;
  CategoryId: string;
  CategoryName: string;
}

export interface AddOrUpdateCategoryPayloadInterface {
  Id: string;
  Name: string;
  ClientId?: string;
  HasExpirationDate: boolean;
  HasManufactureDate: boolean;
  HasModelName: boolean;
  HasPartNumber: boolean;
  ShowSize: boolean;
  AllowExpiredInventory: boolean;
}

export interface AddOrUpdateCategoryResponseInterface {
  Id: string;
}
