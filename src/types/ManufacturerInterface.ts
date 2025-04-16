export interface ManufacturerInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  ClientName: string;
  MobileNumber: string;
  LandlineNumber: string;
  Created: string;
  Modified: null;
}
export interface DeleteManufacturerInterface {
  Id: string;
  AuthKey: string;
}
export interface ManufacturerDetailInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  SameAsManufacturer: boolean;
  SameAsSupplier: boolean;
  Created: string;
  Modified: null;
}
export interface AddOrUpdateManufacturerPayloadInterface {
  Id: string | null;
  Name?: string;
  Address: string;
  EmailAddress: string;
  MobileNumber: string;
  LandlineNumber: string;
  SameAsSupplier: boolean;
  ClientId?: string;
}
export interface AddOrUpdateSupplierPayloadInterface {
  Id: string | null;
  Name?: string;
  Address: string;
  EmailAddress: string;
  ClientId?: string;
  MobileNumber: string;
  LandlineNumber: string;
  SameAsManufacturer: boolean;
}
export interface AddOrManufacturerResponseInterface {
  id: string;
}
